-- Clear existing queries
DELETE FROM queries;

-- Developer Tools & SaaS (8 queries)
INSERT INTO queries (question, category) VALUES
('Best project management tools for software teams', 'Developer Tools'),
('Top code editors and IDEs for professional developers', 'Developer Tools'),
('Best CI/CD platforms for modern DevOps', 'Developer Tools'),
('Top cloud hosting platforms for web applications', 'Developer Tools'),
('Best API development and testing tools', 'Developer Tools'),
('Top database solutions for startups', 'Developer Tools'),
('Best design tools for product teams', 'Developer Tools'),
('Top authentication and security platforms', 'Developer Tools');

-- Startup & Business Tools (5 queries)
INSERT INTO queries (question, category) VALUES
('Best CRM platforms for growing businesses', 'Business Tools'),
('Top email marketing platforms', 'Business Tools'),
('Best payment processing solutions for online businesses', 'Business Tools'),
('Top analytics platforms for product teams', 'Business Tools'),
('Best customer support and helpdesk software', 'Business Tools');

-- Consumer Tech Products (5 queries)
INSERT INTO queries (question, category) VALUES
('Best smartphones for professionals in 2025', 'Consumer Tech'),
('Top laptops for developers and creators', 'Consumer Tech'),
('Best noise-cancelling headphones', 'Consumer Tech'),
('Top smartwatches and fitness trackers', 'Consumer Tech'),
('Best wireless earbuds for everyday use', 'Consumer Tech');

-- Services & Platforms (4 queries)
INSERT INTO queries (question, category) VALUES
('Best VPN services for privacy and security', 'Services'),
('Top password managers for individuals and teams', 'Services'),
('Best cloud storage solutions', 'Services'),
('Top video conferencing platforms for remote teams', 'Services');

-- Emerging Categories (3 queries)
INSERT INTO queries (question, category) VALUES
('Best AI coding assistants and copilots', 'Emerging Tech'),
('Top no-code/low-code platforms for building apps', 'Emerging Tech'),
('Best blockchain and Web3 development platforms', 'Emerging Tech');
