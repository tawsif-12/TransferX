UPDATE [User] 
SET password = '$2a$10$HaSKFp0RlCDYcL7JKK1/oOXT3n1N1Js4J9N2kRnbUM/ar3Txb1u3m'
WHERE email = 'admin@transferx.com';

SELECT id, email, password, role FROM [User] WHERE email = 'admin@transferx.com';
