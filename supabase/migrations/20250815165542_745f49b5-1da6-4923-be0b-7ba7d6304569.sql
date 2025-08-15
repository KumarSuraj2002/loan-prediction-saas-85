UPDATE site_settings 
SET setting_value = jsonb_set(
  setting_value, 
  '{about_us}', 
  '"TEST: This is a real-time update test. If you see this message, the real-time functionality is working correctly!"'
)
WHERE setting_key = 'general';