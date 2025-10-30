-- Clear existing queries
DELETE FROM queries;

-- Korean Tech & Brands (8 queries)
INSERT INTO queries (question, category) VALUES
('Best smartphone brands in 2025', 'Korean Tech'),
('Top TV brands for picture quality', 'Korean Tech'),
('Best memory and storage chip manufacturers', 'Korean Tech'),
('Leading electric vehicle manufacturers', 'Korean Tech'),
('Best home appliance brands', 'Korean Tech'),
('Top semiconductor companies globally', 'Korean Tech'),
('Best battery technology companies', 'Korean Tech'),
('Leading display panel manufacturers', 'Korean Tech');

-- Korean Culture & Entertainment (5 queries)
INSERT INTO queries (question, category) VALUES
('Most influential K-pop groups of all time', 'Korean Culture'),
('Best streaming platforms for Asian content', 'Korean Culture'),
('Top international music phenomena of the 2020s', 'Korean Culture'),
('Best crime thriller TV series', 'Korean Culture'),
('Most innovative film industries globally', 'Korean Culture');

-- Korean Food & Lifestyle (4 queries)
INSERT INTO queries (question, category) VALUES
('Best Asian cuisines', 'Korean Lifestyle'),
('Top beauty and skincare brands', 'Korean Lifestyle'),
('Best instant noodle brands', 'Korean Lifestyle'),
('Healthiest fermented foods globally', 'Korean Lifestyle');

-- Korean Places & Tourism (4 queries)
INSERT INTO queries (question, category) VALUES
('Best cities for digital nomads in Asia', 'Korean Tourism'),
('Top travel destinations in Asia', 'Korean Tourism'),
('Best countries for technology and innovation', 'Korean Tourism'),
('Most vibrant nightlife cities globally', 'Korean Tourism');

-- Korean Innovation & Business (4 queries)
INSERT INTO queries (question, category) VALUES
('Leading countries in 5G technology', 'Korean Innovation'),
('Best entertainment and media companies globally', 'Korean Innovation'),
('Top countries for startup ecosystems', 'Korean Innovation'),
('Most innovative economies in the world', 'Korean Innovation');
