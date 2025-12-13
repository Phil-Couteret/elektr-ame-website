<?php
/**
 * Email Automation System
 * Handles automated email sending with templates and variable replacement
 */

class EmailAutomation {
    private $db;
    private $taxCalculator;

    public function __construct($database) {
        $this->db = $database;
        require_once __DIR__ . '/TaxCalculator.php';
        $this->taxCalculator = new TaxCalculator();
    }

    /**
     * Queue an email for sending
     */
    public function queueEmail($recipientEmail, $recipientName, $templateKey, $variables = [], $memberId = null, $priority = 'normal', $scheduledFor = null) {
        try {
            // Get template
            $stmt = $this->db->prepare("
                SELECT * FROM email_templates 
                WHERE template_key = :key AND active = 1
            ");
            $stmt->execute([':key' => $templateKey]);
            $template = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$template) {
                throw new Exception("Template not found: $templateKey");
            }

            // Determine member's preferred language (default to EN)
            $lang = $this->getMemberLanguage($memberId);

            // Get subject and body in correct language
            $subject = $this->replaceVariables($template["subject_$lang"], $variables);
            $body = $this->replaceVariables($template["body_$lang"], $variables);

            // Insert into queue
            $stmt = $this->db->prepare("
                INSERT INTO email_queue 
                (recipient_email, recipient_name, subject, body, template_key, member_id, priority, scheduled_for, status)
                VALUES 
                (:email, :name, :subject, :body, :template_key, :member_id, :priority, :scheduled_for, 'pending')
            ");

            $stmt->execute([
                ':email' => $recipientEmail,
                ':name' => $recipientName,
                ':subject' => $subject,
                ':body' => $body,
                ':template_key' => $templateKey,
                ':member_id' => $memberId,
                ':priority' => $priority,
                ':scheduled_for' => $scheduledFor
            ]);

            return true;
        } catch (Exception $e) {
            error_log("Email queue error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Send queued emails
     */
    public function processQueue($limit = 50) {
        try {
            // Get pending emails ordered by priority and scheduled time
            $stmt = $this->db->prepare("
                SELECT * FROM email_queue 
                WHERE status = 'pending' 
                AND (scheduled_for IS NULL OR scheduled_for <= NOW())
                ORDER BY 
                    CASE priority 
                        WHEN 'high' THEN 1 
                        WHEN 'normal' THEN 2 
                        WHEN 'low' THEN 3 
                    END,
                    created_at ASC
                LIMIT :limit
            ");
            $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
            $stmt->execute();
            $emails = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $sent = 0;
            $failed = 0;

            foreach ($emails as $email) {
                // Mark as processing
                $this->updateQueueStatus($email['id'], 'processing');

                // Send email
                $result = $this->sendEmail(
                    $email['recipient_email'],
                    $email['recipient_name'],
                    $email['subject'],
                    $email['body']
                );

                if ($result) {
                    // Mark as sent
                    $this->updateQueueStatus($email['id'], 'sent');
                    $this->logEmail($email['member_id'], $email['recipient_email'], $email['template_key'], $email['subject'], 'sent');
                    $sent++;
                } else {
                    // Increment retry count
                    $retryCount = $email['retry_count'] + 1;
                    
                    if ($retryCount >= $email['max_retries']) {
                        // Max retries reached, mark as failed
                        $this->updateQueueStatus($email['id'], 'failed', 'Max retries reached');
                        $this->logEmail($email['member_id'], $email['recipient_email'], $email['template_key'], $email['subject'], 'failed', 'Max retries reached');
                        $failed++;
                    } else {
                        // Schedule for retry (exponential backoff)
                        $retryDelay = pow(2, $retryCount) * 60; // 2^n minutes
                        $scheduledFor = date('Y-m-d H:i:s', time() + $retryDelay);
                        
                        $stmt = $this->db->prepare("
                            UPDATE email_queue 
                            SET status = 'pending', retry_count = :retry, scheduled_for = :scheduled
                            WHERE id = :id
                        ");
                        $stmt->execute([
                            ':retry' => $retryCount,
                            ':scheduled' => $scheduledFor,
                            ':id' => $email['id']
                        ]);
                    }
                }
            }

            return ['sent' => $sent, 'failed' => $failed, 'total' => count($emails)];
        } catch (Exception $e) {
            error_log("Email processing error: " . $e->getMessage());
            return ['sent' => 0, 'failed' => 0, 'total' => 0, 'error' => $e->getMessage()];
        }
    }

    /**
     * Trigger automated emails based on events
     */
    public function triggerAutomation($triggerType, $memberId) {
        try {
            // Get member data
            $member = $this->getMemberData($memberId);
            if (!$member) {
                throw new Exception("Member not found");
            }

            // Get automation rules for this trigger
            $stmt = $this->db->prepare("
                SELECT ear.*, et.template_key
                FROM email_automation_rules ear
                JOIN email_templates et ON ear.template_id = et.id
                WHERE ear.trigger_type = :trigger AND ear.active = 1
            ");
            $stmt->execute([':trigger' => $triggerType]);
            $rules = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($rules as $rule) {
                // Prepare variables for template
                $variables = $this->prepareTemplateVariables($member, $triggerType);

                // Calculate scheduled time based on offset
                $scheduledFor = null;
                if ($rule['days_offset'] != 0) {
                    $scheduledFor = date('Y-m-d H:i:s', strtotime("+{$rule['days_offset']} days"));
                }

                // Queue the email
                $this->queueEmail(
                    $member['email'],
                    $member['first_name'] . ' ' . $member['second_name'],
                    $rule['template_key'],
                    $variables,
                    $memberId,
                    'normal',
                    $scheduledFor
                );
            }

            return true;
        } catch (Exception $e) {
            error_log("Automation trigger error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Check for expiring memberships and send reminders
     */
    public function checkExpiringMemberships() {
        try {
            $results = ['7d' => 0, '3d' => 0, '1d' => 0];

            // Check for memberships expiring in 7, 3, and 1 day(s)
            $periods = [
                ['days' => 7, 'trigger' => 'membership_expiring_7d'],
                ['days' => 3, 'trigger' => 'membership_expiring_3d'],
                ['days' => 1, 'trigger' => 'membership_expiring_1d']
            ];

            foreach ($periods as $period) {
                $stmt = $this->db->prepare("
                SELECT m.* 
                FROM members m
                WHERE m.status = 'approved'
                AND m.membership_type IN ('basic', 'sponsor')
                AND DATE(m.membership_end_date) = DATE(NOW() + INTERVAL :days DAY)
                    AND NOT EXISTS (
                        SELECT 1 FROM email_logs el
                        WHERE el.member_id = m.id
                        AND el.template_key = :template_key
                        AND DATE(el.sent_at) = CURDATE()
                    )
                ");
                
                $templateKey = $period['trigger'];
                $stmt->execute([
                    ':days' => $period['days'],
                    ':template_key' => $templateKey
                ]);
                
                $members = $stmt->fetchAll(PDO::FETCH_ASSOC);

                foreach ($members as $member) {
                    $variables = $this->prepareTemplateVariables($member, $period['trigger']);
                    
                    $this->queueEmail(
                        $member['email'],
                        $member['first_name'] . ' ' . $member['second_name'],
                        $templateKey,
                        $variables,
                        $member['id'],
                        'high'
                    );
                    
                    $results[$period['days'] . 'd']++;
                }
            }

            return $results;
        } catch (Exception $e) {
            error_log("Expiring memberships check error: " . $e->getMessage());
            return ['error' => $e->getMessage()];
        }
    }

    /**
     * Prepare template variables based on member data and trigger
     */
    private function prepareTemplateVariables($member, $triggerType) {
        $variables = [
            'first_name' => $member['first_name'],
            'full_name' => $member['first_name'] . ' ' . $member['second_name'],
            'email' => $member['email'],
            'membership_type' => ucfirst($member['membership_type']),
            'end_date' => $member['membership_end_date'] ? date('F j, Y', strtotime($member['membership_end_date'])) : 'N/A',
            'amount' => $member['payment_amount'] ?? '0.00',
            'date' => date('F j, Y'),
            'receipt_id' => 'EA-' . date('Y') . '-' . str_pad($member['id'], 6, '0', STR_PAD_LEFT)
        ];

        // Add tax deduction info for sponsors
        if ($member['membership_type'] === 'sponsor' && $member['payment_amount'] > 0) {
            $taxCalc = $this->taxCalculator->calculate($member['payment_amount']);
            $variables['tax_deduction'] = number_format($taxCalc['deduction'], 2);
            $variables['net_cost'] = number_format($taxCalc['netCost'], 2);
            $variables['discount_percent'] = number_format($taxCalc['effectiveDiscount'], 1);
            
            // Calculate deduction above €250 for detailed breakdown
            $amount = floatval($member['payment_amount']);
            $above250Amount = max(0, $amount - 250);
            $above250Deduction = $above250Amount * ($taxCalc['recurringBonus'] ? 0.45 : 0.40);
            $variables['tax_deduction_above_250'] = number_format($above250Deduction, 2);
            
            $variables['tax_deduction_info'] = "As a sponsor, you can deduct €{$variables['tax_deduction']} from your taxes (80% on first €250, 40% above).";
            
            if ($taxCalc['recurringBonus']) {
                $variables['recurring_bonus_info'] = "⭐ RECURRING DONOR BONUS: You qualify for 45% deduction on amounts above €250 (3+ consecutive years).";
            } else {
                $variables['recurring_bonus_info'] = "";
            }
            
            $variables['tax_receipt_info'] = "A separate tax receipt email has been sent for your records.";
        } else {
            $variables['tax_deduction_info'] = '';
            $variables['tax_receipt_info'] = '';
            $variables['recurring_bonus_info'] = '';
            $variables['tax_deduction_above_250'] = '0.00';
        }

        return $variables;
    }

    /**
     * Replace variables in template text
     */
    private function replaceVariables($text, $variables) {
        foreach ($variables as $key => $value) {
            $text = str_replace('{{' . $key . '}}', $value, $text);
        }
        
        // Remove any unreplaced variables
        $text = preg_replace('/\{\{[^}]+\}\}/', '', $text);
        
        return $text;
    }

    /**
     * Send email using PHP mail function
     */
    private function sendEmail($to, $toName, $subject, $body) {
        $headers = [
            'From: Elektr-Âme <noreply@elektr-ame.com>',
            'Reply-To: contact@elektr-ame.com',
            'X-Mailer: PHP/' . phpversion(),
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8'
        ];

        $fullBody = $body . "\n\n---\nElektr-Âme - Electronic Music Community\nhttps://www.elektr-ame.com";

        return mail($to, $subject, $fullBody, implode("\r\n", $headers));
    }

    /**
     * Get member data
     */
    private function getMemberData($memberId) {
        $stmt = $this->db->prepare("SELECT * FROM members WHERE id = :id");
        $stmt->execute([':id' => $memberId]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Get member's preferred language
     */
    private function getMemberLanguage($memberId) {
        if (!$memberId) {
            return 'en';
        }

        $stmt = $this->db->prepare("SELECT country FROM members WHERE id = :id");
        $stmt->execute([':id' => $memberId]);
        $member = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$member) {
            return 'en';
        }

        // Determine language based on country
        $country = strtolower($member['country'] ?? '');
        if (strpos($country, 'spain') !== false || strpos($country, 'españa') !== false) {
            return 'es';
        } elseif (strpos($country, 'catalu') !== false) {
            return 'ca';
        }

        return 'en';
    }

    /**
     * Update queue status
     */
    private function updateQueueStatus($queueId, $status, $errorMessage = null) {
        // If status is 'sent', also update sent_at timestamp
        if ($status === 'sent') {
            $stmt = $this->db->prepare("
                UPDATE email_queue 
                SET status = :status, 
                    error_message = :error,
                    sent_at = NOW()
                WHERE id = :id
            ");
        } else {
            $stmt = $this->db->prepare("
                UPDATE email_queue 
                SET status = :status, 
                    error_message = :error
                WHERE id = :id
            ");
        }
        
        $stmt->execute([
            ':status' => $status,
            ':error' => $errorMessage,
            ':id' => $queueId
        ]);
    }

    /**
     * Log email send
     */
    private function logEmail($memberId, $email, $templateKey, $subject, $status, $errorMessage = null) {
        $stmt = $this->db->prepare("
            INSERT INTO email_logs 
            (member_id, email, template_key, subject, status, error_message)
            VALUES 
            (:member_id, :email, :template_key, :subject, :status, :error)
        ");
        $stmt->execute([
            ':member_id' => $memberId,
            ':email' => $email,
            ':template_key' => $templateKey,
            ':subject' => $subject,
            ':status' => $status,
            ':error' => $errorMessage
        ]);
    }

    /**
     * Get email statistics
     */
    public function getStatistics($days = 30) {
        $stmt = $this->db->prepare("
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) as sent,
                SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
                template_key
            FROM email_logs
            WHERE sent_at >= DATE_SUB(NOW(), INTERVAL :days DAY)
            GROUP BY template_key
        ");
        $stmt->execute([':days' => $days]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}

