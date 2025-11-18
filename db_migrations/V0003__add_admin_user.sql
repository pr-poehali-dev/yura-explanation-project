
INSERT INTO users (email, password_hash, role, full_name, phone, active_role, created_at) 
VALUES ('admin@dentalcrm.ru', 'admin123', 'project_admin', 'Администратор Системы', '+7 (999) 123-45-67', 'project_admin', CURRENT_TIMESTAMP);

INSERT INTO user_roles (user_id, role, created_at)
SELECT id, 'project_admin', CURRENT_TIMESTAMP FROM users WHERE email = 'admin@dentalcrm.ru';

INSERT INTO user_roles (user_id, role, created_at)
SELECT id, 'support', CURRENT_TIMESTAMP FROM users WHERE email = 'admin@dentalcrm.ru';

INSERT INTO user_roles (user_id, role, created_at)
SELECT id, 'admin', CURRENT_TIMESTAMP FROM users WHERE email = 'admin@dentalcrm.ru';
