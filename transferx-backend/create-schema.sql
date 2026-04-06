-- Create User table
CREATE TABLE [User] (
    [id] INT NOT NULL IDENTITY(1,1),
    [email] NVARCHAR(255) NOT NULL UNIQUE,
    [password] NVARCHAR(255) NOT NULL,
    [fullName] NVARCHAR(255),
    [role] NVARCHAR(50) NOT NULL DEFAULT 'PLAYER',
    [created_at] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [updated_at] DATETIME2 NOT NULL DEFAULT GETDATE(),
    PRIMARY KEY ([id])
);
CREATE INDEX [IX_User_email] ON [User]([email]);
CREATE INDEX [IX_User_role] ON [User]([role]);

-- Create PlayerProfile table
CREATE TABLE [PlayerProfile] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL UNIQUE,
    [position] NVARCHAR(50),
    [nationality] NVARCHAR(100),
    [dateOfBirth] DATETIME2,
    [height] FLOAT,
    [weight] FLOAT,
    [preferredFoot] NVARCHAR(50),
    [currentClubId] INT,
    [marketValue] FLOAT NOT NULL DEFAULT 0,
    [goalsScored] INT NOT NULL DEFAULT 0,
    [assists] INT NOT NULL DEFAULT 0,
    [appearances] INT NOT NULL DEFAULT 0,
    [rating] FLOAT NOT NULL DEFAULT 0,
    [bio] NVARCHAR(MAX),
    PRIMARY KEY ([id]),
    FOREIGN KEY ([userId]) REFERENCES [User]([id]) ON DELETE CASCADE
);

-- Create AgentProfile table
CREATE TABLE [AgentProfile] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL UNIQUE,
    [agency] NVARCHAR(255),
    [licenseNumber] NVARCHAR(50),
    [yearsExperience] INT NOT NULL DEFAULT 0,
    PRIMARY KEY ([id]),
    FOREIGN KEY ([userId]) REFERENCES [User]([id]) ON DELETE CASCADE
);

PRINT 'Tables created successfully'
