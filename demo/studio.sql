PRAGMA foreign_keys = ON;

BEGIN;

CREATE TABLE clients (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL
);

CREATE TABLE projects (
    id INTEGER PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES clients (id),
    name TEXT NOT NULL,
    status TEXT NOT NULL,
    due_date TEXT
);

CREATE TABLE invoices (
    id INTEGER PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects (id),
    amount_cents INTEGER NOT NULL CHECK (amount_cents >= 0),
    issued_on TEXT NOT NULL,
    paid_on TEXT
);

CREATE INDEX projects_by_client ON projects (client_id);
CREATE INDEX invoices_by_project ON invoices (project_id);

CREATE VIEW open_invoices AS
SELECT invoices.id, clients.name AS client, projects.name AS project,
       invoices.amount_cents, invoices.issued_on
FROM invoices
JOIN projects ON projects.id = invoices.project_id
JOIN clients ON clients.id = projects.client_id
WHERE invoices.paid_on IS NULL;

INSERT INTO clients (id, name, city, email, status) VALUES
    (1, 'Fieldwork Studio', 'Vilnius', 'hello@fieldwork.example', 'Active'),
    (2, 'Northline Goods', 'Portland', 'team@northline.example', 'Active'),
    (3, 'Atlas & Oak', 'Copenhagen', 'studio@atlasandoak.example', 'Active'),
    (4, 'Pine Harbor Press', 'Helsinki', 'editor@pineharbor.example', 'Archived');

INSERT INTO projects (id, client_id, name, status, due_date) VALUES
    (1, 1, 'Studio website', 'In progress', '2026-12-15'),
    (2, 2, 'Winter catalog', 'In review', '2026-12-04'),
    (3, 3, 'Brand guidelines', 'Complete', '2026-10-30'),
    (4, 4, 'Spring book covers', 'Complete', '2026-04-11');

INSERT INTO invoices (id, project_id, amount_cents, issued_on, paid_on) VALUES
    (101, 1, 125000, '2026-11-10', NULL),
    (102, 2, 85000, '2026-11-18', NULL),
    (103, 3, 160000, '2026-10-30', '2026-11-07'),
    (104, 4, 95000, '2026-04-11', '2026-04-17');

COMMIT;
