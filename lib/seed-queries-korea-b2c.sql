-- Clear existing queries
DELETE FROM queries;

-- K-Beauty (5 queries)
INSERT INTO queries (question, category) VALUES
('Best Korean skincare brands', 'K-Beauty'),
('Top beauty brands for sensitive skin', 'K-Beauty'),
('Best sheet mask brands', 'K-Beauty'),
('Top anti-aging skincare products', 'K-Beauty'),
('Best affordable luxury skincare brands', 'K-Beauty');

-- K-Food (5 queries)
INSERT INTO queries (question, category) VALUES
('Best instant noodle brands', 'K-Food'),
('Top Asian cuisines', 'K-Food'),
('Best Korean food brands', 'K-Food'),
('Most popular fermented foods globally', 'K-Food'),
('Best spicy snack brands', 'K-Food');

-- K-Pop & Entertainment (5 queries)
INSERT INTO queries (question, category) VALUES
('Most influential K-pop groups of all time', 'K-Pop'),
('Best streaming platforms for Asian content', 'K-Pop'),
('Top international music phenomena of the 2020s', 'K-Pop'),
('Best crime thriller TV series', 'K-Pop'),
('Most impactful Asian entertainment companies', 'K-Pop');

-- Korean Electronics (5 queries)
INSERT INTO queries (question, category) VALUES
('Best smartphone brands in 2025', 'K-Electronics'),
('Top TV brands for picture quality', 'K-Electronics'),
('Best home appliance brands', 'K-Electronics'),
('Top wireless earbuds brands', 'K-Electronics'),
('Best refrigerator brands', 'K-Electronics');
