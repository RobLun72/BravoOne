"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  //NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  //navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { usePathname } from "next/navigation";

interface MenuComponentProps {
  topMenu: string;
  paths: string[];
  items: { title: string; path: string; href: string; description: string }[];
}

const components: MenuComponentProps[] = [
  {
    topMenu: "Actions",
    paths: ["start", "tenders", "about"],
    items: [
      {
        title: "Start",
        href: "/",
        path: "start",
        description: "The landing page.",
      },
      {
        title: "Activity Cards",
        href: "/tenders",
        path: "tenders",
        description: "The Activity Cards.",
      },
      {
        title: "About",
        href: "/about",
        path: "about",
        description: "Description about how the app is built.",
      },
    ],
  },
];

export function AppMenu() {
  const path = usePathname();
  const pathParts = path.split("/");

  const mapComponents: MenuComponentProps[] = components;

  return (
    <div className="flex md:min-w-3xl min-w-sm max-w-7xl items-center  bg-white px-4 py-2">
      <Link href="/" className="text-xl font-bold text-white mr-4">
        <Image
          src="/bravida.png"
          alt="bravida logo"
          width={300}
          height={200}
          priority
        />
      </Link>
      <NavigationMenu>
        <NavigationMenuList>
          {mapComponents.map((component) => (
            <NavigationMenuItem key={"menu-" + component.topMenu}>
              <NavigationMenuTrigger
                className={cn(
                  "text-black",
                  component.paths.includes(pathParts[1]) && "underline"
                )}
              >
                {component.topMenu}
              </NavigationMenuTrigger>
              <NavigationMenuContent className="bg-white">
                <ul className="grid w-[200px] gap-3 p-4  grid-cols-1">
                  {component.items.map((item) => (
                    <ListItem
                      key={item.title}
                      title={item.title}
                      href={item.href}
                      className={cn(
                        "",
                        pathParts[1] === item.path && "bg-neutral-200"
                      )}
                    >
                      {item.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

const ListItem = ({
  className,
  title,
  href,
  children,
}: {
  className: string;
  title: string;
  href: string;
  children: React.ReactNode;
}) => {
  return (
    <li>
      <Link
        href={href}
        className={cn(
          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          className
        )}
      >
        <div className="text-sm font-medium leading-none">{title}</div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
          {children}
        </p>
      </Link>
    </li>
  );
};
