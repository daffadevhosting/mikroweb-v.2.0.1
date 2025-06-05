require 'dotenv'
Dotenv.load

Jekyll::Hooks.register :site, :after_init do |site|
  site.config['api_key'] = ENV['api_key']
  site.config['auth_domain'] = ENV['auth_domain']
  site.config['database_url'] = ENV['database_url']
  site.config['project_id'] = ENV['project_id']
  site.config['storage_bucket'] = ENV['storage_bucket']
  site.config['sender_id'] = ENV['sender_id']
  site.config['app_id'] = ENV['app_id']
  site.config['measure_id'] = ENV['measure_id']
  site.config['php_url'] = ENV['php_url']
end