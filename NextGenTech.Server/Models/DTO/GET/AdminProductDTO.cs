using System;
using System.Collections.Generic;
using NextGenTech.Server.Models.Domain;

namespace NextGenTech.Server.Models.DTO.GET
{
    public class AdminProductDTO
    {
        public int ProductId { get; set; }

        public string Name { get; set; } = null!;
        public int? StockQuantity { get; set; }
        public decimal Price { get; set; }
        public virtual CategoryDTO? Category { get; set; }
        public ICollection<ProductImageDTO> ProductImages { get; set; } = new List<ProductImageDTO>();
        public ICollection<ProductColorDTO> ProductColors { get; set; } = new List<ProductColorDTO>();
    }
}   