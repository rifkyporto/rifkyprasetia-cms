type SocialType = {
  socialKey: string;
  socialName: string;
  logo: string;
  color: string;
}

export const SOCIALLIST: SocialType[] = [
  {
    socialKey: "instagram",
    socialName: "Instagram",
    logo: "uil:instagram-alt",
    color: "text-pink-600"
  },
  {
    socialKey: "linkedin",
    socialName: "Linkedin",
    logo: "mdi:linkedin",
    color: "text-blue-600"
  },
  {
    socialKey: "youtube",
    socialName: "Youtube",
    logo: "mdi:youtube",
    color: "text-red-600"
  },
];
