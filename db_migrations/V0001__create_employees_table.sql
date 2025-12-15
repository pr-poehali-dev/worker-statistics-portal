CREATE TABLE IF NOT EXISTS t_p56655461_worker_statistics_po.employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('active', 'vacation', 'inactive')),
    links INTEGER NOT NULL DEFAULT 0,
    reports INTEGER NOT NULL DEFAULT 0,
    warnings INTEGER NOT NULL DEFAULT 0,
    salary INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_employees_department ON t_p56655461_worker_statistics_po.employees(department);
CREATE INDEX idx_employees_status ON t_p56655461_worker_statistics_po.employees(status);

INSERT INTO t_p56655461_worker_statistics_po.employees (name, department, status, links, reports, warnings, salary) VALUES
('Анна Смирнова', 'Продажи', 'active', 145, 28, 0, 85000),
('Дмитрий Иванов', 'Маркетинг', 'active', 203, 32, 1, 95000),
('Елена Петрова', 'Продажи', 'vacation', 167, 25, 0, 78000),
('Алексей Козлов', 'IT', 'active', 89, 19, 2, 120000),
('Мария Волкова', 'HR', 'active', 112, 24, 0, 72000),
('Сергей Морозов', 'Продажи', 'active', 198, 30, 0, 92000),
('Ольга Новикова', 'IT', 'inactive', 45, 8, 3, 115000),
('Иван Соколов', 'Маркетинг', 'active', 178, 27, 1, 88000);
