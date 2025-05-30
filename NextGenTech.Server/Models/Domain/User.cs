﻿using System;
using System.Collections.Generic;


namespace NextGenTech.Server.Models.Domain;

public partial class User
{   
    public int UserId { get; set; }
    public string? FullName { get; set; } 

    public string? Email { get; set; } 

    public string? PasswordHash { get; set; } 

    public string? Phone { get; set; }

    public string? City { get; set; }

    public string? District { get; set; }

    public string? Ward { get; set; }

    public string? AvatarImageUrl { get; set; }

    public string Role { get; set; } = "user"!;

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<Cart> Carts { get; set; } = new List<Cart>();

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
}
