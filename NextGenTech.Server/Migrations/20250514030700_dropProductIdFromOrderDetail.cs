using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NextGenTech.Server.Migrations
{
    /// <inheritdoc />
    public partial class dropProductIdFromOrderDetail : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Drop all foreign key constraints related to ProductId
            migrationBuilder.Sql(@"
                -- Drop the first possible foreign key
                IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK__OrderDeta__Produ__74AE54BC')
                BEGIN
                    ALTER TABLE [OrderDetails] DROP CONSTRAINT [FK__OrderDeta__Produ__74AE54BC]
                END

                -- Drop the second possible foreign key
                IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_OrderDetails_Products_ProductId')
                BEGIN
                    ALTER TABLE [OrderDetails] DROP CONSTRAINT [FK_OrderDetails_Products_ProductId]
                END

                -- Drop any other foreign key that might reference ProductId
                DECLARE @constraintName NVARCHAR(128)
                SELECT @constraintName = name
                FROM sys.foreign_keys
                WHERE parent_object_id = OBJECT_ID('OrderDetails')
                AND REFERENCED_OBJECT_ID = OBJECT_ID('Products')

                IF @constraintName IS NOT NULL
                BEGIN
                    EXEC('ALTER TABLE [OrderDetails] DROP CONSTRAINT [' + @constraintName + ']')
                END
            ");

            // Check if index exists before trying to drop it
            migrationBuilder.Sql(@"
                IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_OrderDetails_ProductId' AND object_id = OBJECT_ID('OrderDetails'))
                BEGIN
                    DROP INDEX [IX_OrderDetails_ProductId] ON [OrderDetails]
                END
            ");

            // First add the ProductColorId column if it doesn't exist
            migrationBuilder.Sql(@"
                IF NOT EXISTS (
                    SELECT * FROM sys.columns
                    WHERE Name = 'ProductColorId' AND Object_ID = Object_ID('OrderDetails')
                )
                BEGIN
                    ALTER TABLE [OrderDetails] ADD [ProductColorId] INT NULL
                END
            ");

            // Create index for the new column
            migrationBuilder.Sql(@"
                IF NOT EXISTS (
                    SELECT * FROM sys.indexes
                    WHERE name = 'IX_OrderDetails_ProductColorId' AND object_id = OBJECT_ID('OrderDetails')
                )
                BEGIN
                    CREATE INDEX [IX_OrderDetails_ProductColorId] ON [OrderDetails]([ProductColorId])
                END
            ");

            // Now it's safe to drop the column
            migrationBuilder.DropColumn(
                name: "ProductId",
                table: "OrderDetails");

            // Add foreign key for ProductColorId
            migrationBuilder.Sql(@"
                IF EXISTS (
                    SELECT * FROM sys.columns
                    WHERE Name = 'ProductColorId' AND Object_ID = Object_ID('OrderDetails')
                )
                BEGIN
                    IF NOT EXISTS (
                        SELECT * FROM sys.foreign_keys
                        WHERE name = 'FK_OrderDetails_ProductColors_ProductColorId'
                    )
                    BEGIN
                        ALTER TABLE [OrderDetails] ADD CONSTRAINT [FK_OrderDetails_ProductColors_ProductColorId]
                        FOREIGN KEY ([ProductColorId]) REFERENCES [ProductColors] ([ProductColorID]) ON DELETE CASCADE
                    END
                END
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // First drop the existing foreign key if it exists
            migrationBuilder.Sql(@"
                IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_OrderDetails_ProductColors_ProductColorId')
                BEGIN
                    ALTER TABLE [OrderDetails] DROP CONSTRAINT [FK_OrderDetails_ProductColors_ProductColorId]
                END
            ");

            // Add the ProductId column back
            migrationBuilder.AddColumn<int>(
                name: "ProductId",
                table: "OrderDetails",
                type: "int",
                nullable: true);

            // Create index for the foreign key
            migrationBuilder.CreateIndex(
                name: "IX_OrderDetails_ProductId",
                table: "OrderDetails",
                column: "ProductId");

            // Re-add the foreign keys using SQL to check if columns exist
            migrationBuilder.Sql(@"
                IF EXISTS (
                    SELECT * FROM sys.columns
                    WHERE Name = 'ProductColorId' AND Object_ID = Object_ID('OrderDetails')
                )
                BEGIN
                    IF NOT EXISTS (
                        SELECT * FROM sys.foreign_keys
                        WHERE name = 'FK_OrderDetails_ProductColors_ProductColorId'
                    )
                    BEGIN
                        ALTER TABLE [OrderDetails] ADD CONSTRAINT [FK_OrderDetails_ProductColors_ProductColorId]
                        FOREIGN KEY ([ProductColorId]) REFERENCES [ProductColors] ([ProductColorID])
                    END
                END
            ");

            migrationBuilder.Sql(@"
                IF EXISTS (
                    SELECT * FROM sys.columns
                    WHERE Name = 'ProductId' AND Object_ID = Object_ID('OrderDetails')
                )
                BEGIN
                    -- Check if the foreign key already exists before adding it
                    IF NOT EXISTS (
                        SELECT * FROM sys.foreign_keys
                        WHERE name = 'FK_OrderDetails_Products_ProductId'
                    ) AND NOT EXISTS (
                        SELECT * FROM sys.foreign_keys
                        WHERE name = 'FK__OrderDeta__Produ__74AE54BC'
                    )
                    BEGIN
                        -- Make sure the index exists before adding the foreign key
                        IF EXISTS (
                            SELECT * FROM sys.indexes
                            WHERE name = 'IX_OrderDetails_ProductId' AND object_id = OBJECT_ID('OrderDetails')
                        )
                        BEGIN
                            ALTER TABLE [OrderDetails] ADD CONSTRAINT [FK_OrderDetails_Products_ProductId]
                            FOREIGN KEY ([ProductId]) REFERENCES [Products] ([ProductID])
                        END
                    END
                END
            ");

            // We don't drop the ProductColorId column in the Down method
            // because it's now part of the model and needed for the application
        }
    }
}
