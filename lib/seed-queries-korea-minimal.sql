-- Clear existing queries
DELETE FROM queries;

-- K-Beauty (2 queries)
INSERT INTO queries (question, category) VALUES
('Best Korean skincare brands', 'K-Beauty'),
('Best sheet mask brands', 'K-Beauty');

-- K-Food (2 queries)
INSERT INTO queries (question, category) VALUES
('Best instant noodle brands', 'K-Food'),
('Top Asian cuisines', 'K-Food');

-- K-Pop (2 queries)
INSERT INTO queries (question, category) VALUES
('Most influential K-pop groups of all time', 'K-Pop'),
('Best crime thriller TV series', 'K-Pop');

-- K-Electronics (2 queries)
INSERT INTO queries (question, category) VALUES
('Best smartphone brands in 2025', 'K-Electronics'),
('Top TV brands for picture quality', 'K-Electronics');
