import React from "react";

interface NavDaisyUISearchProps {
  brandName?: string;
  searchPlaceholder?: string;
  avatarSrc?: string;
  menuItems?: Array<{ label: string; href: string; badge?: string }>;
}

export const NavDaisyUISearch: React.FC<NavDaisyUISearchProps> = ({
  brandName = "daisyUI",
  searchPlaceholder = "Search",
  avatarSrc = "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
  menuItems = [
    { label: "Profile", href: "/profile", badge: "New" },
    { label: "Settings", href: "/settings" },
    { label: "Logout", href: "/logout" }
  ]
}) => {
  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">{brandName}</a>
      </div>
      <div className="flex-none gap-2">
        <div className="form-control">
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="input input-bordered w-24 md:w-auto"
          />
        </div>
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img alt="Avatar" src={avatarSrc} />
            </div>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
            {menuItems.map((item, index) => (
              <li key={index}>
                <a href={item.href} className="justify-between">
                  {item.label}
                  {item.badge && <span className="badge">{item.badge}</span>}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};