
ALTER TABLE users ADD COLUMN IF NOT EXISTS active_role VARCHAR(50);

CREATE TABLE IF NOT EXISTS user_roles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    role VARCHAR(50) NOT NULL CHECK (role IN ('patient', 'doctor', 'admin', 'director', 'nurse', 'support', 'project_admin')),
    clinic_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, role, clinic_id)
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);
