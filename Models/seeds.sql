INSERT INTO department (name)
VALUES ('Sales'), ('Marketing'), 
('Finance'), ('Legal'), ('Engineering');

INSERT INTO role (title, salary, department_id)
VALUES 
('VP of Sales', 150000, 1),
('Director of Sales', 100000, 1),
('Vp of Marketing', 150000, 2),
('Director of Marketing', 100000, 2),
('VP of Finance', 150000, 3),
('Director of Finance', 100000, 3),
('Lead Counsel', 200000, 4),
('VP of Engineering', 150000, 5),
('Software Engineer', 90000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Abraham', 'Lincoln', 1, null),
('Lloyd', 'Christmas', 2, 1),
('Harry', 'Dunne', 3, null),
('William', 'Wallace', 4, 3),
('Edward', 'Longshanks', 5, null),
('Gordon', 'Gecko', 6, 5),
('James', 'Ryan', 7, null),
('Bill', 'Lumberg', 8, null),
('Bart', 'Simpson', 9, 8);