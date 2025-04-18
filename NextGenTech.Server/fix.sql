Build started...
Build succeeded.
IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
ALTER TABLE [ProductColors] ADD [ColorCode] nvarchar(max) NOT NULL DEFAULT N'';

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250317120229_addcolorcodetoproductcolor', N'9.0.3');

ALTER TABLE [Products] ADD [LongDescription] nvarchar(max) NULL;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250318044518_addlongdestoproduct', N'9.0.3');

ALTER TABLE [CartDetails] DROP CONSTRAINT [FK__CartDetai__Produ__5441852A];

ALTER TABLE [Users] ADD [AccessFailedCount] int NOT NULL DEFAULT 0;

ALTER TABLE [Users] ADD [ConcurrencyStamp] nvarchar(max) NULL;

ALTER TABLE [Users] ADD [EmailConfirmed] bit NOT NULL DEFAULT CAST(0 AS bit);

ALTER TABLE [Users] ADD [Id] nvarchar(max) NULL;

ALTER TABLE [Users] ADD [LockoutEnabled] bit NOT NULL DEFAULT CAST(0 AS bit);

ALTER TABLE [Users] ADD [LockoutEnd] datetimeoffset NULL;

ALTER TABLE [Users] ADD [NormalizedEmail] nvarchar(max) NULL;

ALTER TABLE [Users] ADD [NormalizedUserName] nvarchar(max) NULL;

ALTER TABLE [Users] ADD [PhoneNumber] nvarchar(max) NULL;

ALTER TABLE [Users] ADD [PhoneNumberConfirmed] bit NOT NULL DEFAULT CAST(0 AS bit);

ALTER TABLE [Users] ADD [SecurityStamp] nvarchar(max) NULL;

ALTER TABLE [Users] ADD [TwoFactorEnabled] bit NOT NULL DEFAULT CAST(0 AS bit);

ALTER TABLE [Users] ADD [UserName] nvarchar(max) NULL;

ALTER TABLE [CartDetails] ADD [ProductColorId] int NULL;

CREATE INDEX [IX_CartDetails_ProductColorId] ON [CartDetails] ([ProductColorId]);

ALTER TABLE [CartDetails] ADD CONSTRAINT [FK_CartDetails_ProductColors_ProductColorId] FOREIGN KEY ([ProductColorId]) REFERENCES [ProductColors] ([ProductColorID]);

ALTER TABLE [CartDetails] ADD CONSTRAINT [FK_CartDetails_Products_ProductId] FOREIGN KEY ([ProductId]) REFERENCES [Products] ([ProductID]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250402014018_UpdateCartDetailForeignKey', N'9.0.3');

DECLARE @var sysname;
SELECT @var = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ProductColors]') AND [c].[name] = N'ColorCode');
IF @var IS NOT NULL EXEC(N'ALTER TABLE [ProductColors] DROP CONSTRAINT [' + @var + '];');
ALTER TABLE [ProductColors] ADD DEFAULT N'' FOR [ColorCode];

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250402023900_UpdateCartDetails', N'9.0.3');

ALTER TABLE [CartDetails] DROP CONSTRAINT [FK_CartDetails_ProductColors_ProductColorId];

ALTER TABLE [CartDetails] DROP CONSTRAINT [FK__CartDetai__CartI__534D60F1];

ALTER TABLE [CartDetails] DROP CONSTRAINT [PK__CartDeta__01B6A6D4FABBC2D5];

ALTER TABLE [CartDetails] ADD CONSTRAINT [PK_CartDetails] PRIMARY KEY ([CartDetailID]);

ALTER TABLE [CartDetails] ADD CONSTRAINT [FK_CartDetails_Carts_CartID] FOREIGN KEY ([CartID]) REFERENCES [Carts] ([CartID]) ON DELETE CASCADE;

ALTER TABLE [CartDetails] ADD CONSTRAINT [FK_CartDetails_ProductColors_ProductColorId] FOREIGN KEY ([ProductColorId]) REFERENCES [ProductColors] ([ProductColorID]) ON DELETE CASCADE;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250402024533_RemoveProductIdFromCartDetails', N'9.0.3');

ALTER TABLE CartDetails DROP COLUMN ProductId;


INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250402025030_RemoveProductIdFromCartDetailss', N'9.0.3');

COMMIT;
GO


