using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NextGenTech.Server.Migrations
{
    /// <inheritdoc />
    public partial class RemoveProductIdFromCartDetails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CartDetails_ProductColors_ProductColorId",
                table: "CartDetails");

            migrationBuilder.DropForeignKey(
                name: "FK__CartDetai__CartI__534D60F1",
                table: "CartDetails");

            migrationBuilder.DropPrimaryKey(
                name: "PK__CartDeta__01B6A6D4FABBC2D5",
                table: "CartDetails");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CartDetails",
                table: "CartDetails",
                column: "CartDetailID");

            migrationBuilder.AddForeignKey(
                name: "FK_CartDetails_Carts_CartID",
                table: "CartDetails",
                column: "CartID",
                principalTable: "Carts",
                principalColumn: "CartID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_CartDetails_ProductColors_ProductColorId",
                table: "CartDetails",
                column: "ProductColorId",
                principalTable: "ProductColors",
                principalColumn: "ProductColorID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CartDetails_Carts_CartID",
                table: "CartDetails");

            migrationBuilder.DropForeignKey(
                name: "FK_CartDetails_ProductColors_ProductColorId",
                table: "CartDetails");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CartDetails",
                table: "CartDetails");

            migrationBuilder.AddPrimaryKey(
                name: "PK__CartDeta__01B6A6D4FABBC2D5",
                table: "CartDetails",
                column: "CartDetailID");

            migrationBuilder.AddForeignKey(
                name: "FK_CartDetails_ProductColors_ProductColorId",
                table: "CartDetails",
                column: "ProductColorId",
                principalTable: "ProductColors",
                principalColumn: "ProductColorID");

            migrationBuilder.AddForeignKey(
                name: "FK__CartDetai__CartI__534D60F1",
                table: "CartDetails",
                column: "CartID",
                principalTable: "Carts",
                principalColumn: "CartID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
