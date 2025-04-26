using System;
using System.Collections.Generic;

namespace NextGenTech.Server.Models.DTO.GET;

public partial class CustomerProductImageDTO
{
    public int ImageId { get; set; }

    public string ImageUrl { get; set; } = null!;

    public bool? IsPrimary { get; set; }

}
