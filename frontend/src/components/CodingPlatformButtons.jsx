import { GithubIcon, CodeIcon, ExternalLinkIcon, ZapIcon, TrophyIcon } from "lucide-react";

const CodingPlatformButtons = ({ user }) => {
  const platforms = [
    {
      name: "GitHub",
      url: user.githubUrl,
      icon: GithubIcon,
      color: "btn-outline",
      bgColor: "hover:bg-gray-100",
    },
    {
      name: "LeetCode",
      url: user.leetcodeUrl,
      icon: ZapIcon,
      color: "btn-outline",
      bgColor: "hover:bg-orange-100",
    },
    {
      name: "Codeforces",
      url: user.codeforcesUrl,
      icon: TrophyIcon,
      color: "btn-outline",
      bgColor: "hover:bg-blue-100",
    },
    {
      name: "CodeChef",
      url: user.codechefUrl,
      icon: CodeIcon,
      color: "btn-outline",
      bgColor: "hover:bg-green-100",
    },
  ];

  const hasAnyPlatform = platforms.some((platform) => platform.url);

  if (!hasAnyPlatform) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-3 mt-3">
  {platforms.map((platform) => {
    if (!platform.url) return null;

    return (
      <a
        key={platform.name}
        href={platform.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-xl shadow-sm 
          text-xs font-medium transition-all duration-200
          ${platform.bgColor} ${platform.color}
          hover:scale-105 hover:shadow-md hover:brightness-105
        `}
        title={`View ${platform.name} profile`}
      >
        <platform.icon className="size-4 opacity-80 group-hover:opacity-100 transition-opacity" />
        <span>{platform.name}</span>
        <ExternalLinkIcon className="size-3 opacity-70" />
      </a>
    );
  })}
</div>


  );
};

export default CodingPlatformButtons; 