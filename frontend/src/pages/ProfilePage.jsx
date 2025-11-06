import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "../lib/api";
import useAuthUser from "../hooks/useAuthUser";
import { EditIcon, SaveIcon, XIcon, MapPinIcon, GlobeIcon, BookOpenIcon } from "lucide-react";
import { LANGUAGE_TO_FLAG } from "../constants";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { authUser } = useAuthUser();
  console.log("Auth User in ProfilePage:", authUser.leetcodeUrl);
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    location: authUser?.location || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    github: authUser?.githubUrl || "",
    leetcode: authUser?.leetcodeUrl || "",
    codeforces: authUser?.codeforcesUrl || "",
  });

  const { mutate: updateUserMutation, isPending } = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });

  const handleSave = () => {
    updateUserMutation(formData);
  };

  const handleCancel = () => {
    setFormData({
      fullName: authUser?.fullName || "",
      bio: authUser?.bio || "",
      location: authUser?.location || "",
      nativeLanguage: authUser?.nativeLanguage || "",
      learningLanguage: authUser?.learningLanguage || "",
      github: authUser?.github || "",
      leetcode: authUser?.leetcode || "",
      codeforces: authUser?.codeforces || "",
    });
    setIsEditing(false);
  };

  const getLanguageFlag = (language) => {
    if (!language) return null;
    const langLower = language.toLowerCase();
    const countryCode = LANGUAGE_TO_FLAG[langLower];
    if (countryCode) {
      return (
        <img
          src={`https://flagcdn.com/24x18/${countryCode}.png`}
          alt={`${langLower} flag`}
          className="h-3 mr-1 inline-block"
        />
      );
    }
    return null;
  };

  if (!authUser) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">My Profile</h1>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={isPending}
                      className="btn btn-primary btn-sm"
                    >
                      <SaveIcon className="h-4 w-4 mr-2" />
                      {isPending ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="btn btn-outline btn-sm"
                    >
                      <XIcon className="h-4 w-4 mr-2" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn btn-outline btn-sm"
                  >
                    <EditIcon className="h-4 w-4 mr-2" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Picture Section */}
              <div className="lg:col-span-1">
                <div className="flex flex-col items-center">
                  <div className="avatar mb-4">
                    <div className="w-32 h-32 rounded-full">
                      <img src={authUser.profilePic} alt={authUser.fullName} />
                    </div>
                  </div>
                  <h2 className="text-xl font-semibold text-center">{authUser.fullName}</h2>
                  <p className="text-base-content opacity-70 text-center">{authUser.email}</p>
                </div>
              </div>

              {/* Profile Details Section */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">
                        <span className="label-text font-medium">Full Name</span>
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="input input-bordered w-full"
                          placeholder="Enter your full name"
                        />
                      ) : (
                        <p className="text-base-content">{authUser.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label className="label">
                        <span className="label-text font-medium">Location</span>
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="input input-bordered w-full"
                          placeholder="Enter your location"
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <MapPinIcon className="h-4 w-4 opacity-70" />
                          <span>{authUser.location || "Not specified"}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text font-medium">Bio</span>
                    </label>
                    {isEditing ? (
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        className="textarea textarea-bordered w-full h-24"
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <p className="text-base-content">{authUser.bio || "No bio added yet"}</p>
                    )}
                  </div>
                </div>

                {/* Languages */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Languages</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">
                        <span className="label-text font-medium">Native Language</span>
                      </label>
                      {isEditing ? (
                        <select
                          value={formData.nativeLanguage}
                          onChange={(e) => setFormData({ ...formData, nativeLanguage: e.target.value })}
                          className="select select-bordered w-full"
                        >
                          <option value="">Select native language</option>
                          <option value="english">English</option>
                          <option value="spanish">Spanish</option>
                          <option value="french">French</option>
                          <option value="german">German</option>
                          <option value="italian">Italian</option>
                          <option value="portuguese">Portuguese</option>
                          <option value="russian">Russian</option>
                          <option value="chinese">Chinese</option>
                          <option value="japanese">Japanese</option>
                          <option value="korean">Korean</option>
                          <option value="arabic">Arabic</option>
                          <option value="hindi">Hindi</option>
                        </select>
                      ) : (
                        <div className="flex items-center gap-2">
                          {getLanguageFlag(authUser.nativeLanguage)}
                          <span className="capitalize">{authUser.nativeLanguage || "Not specified"}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="label">
                        <span className="label-text font-medium">Learning Language</span>
                      </label>
                      {isEditing ? (
                        <select
                          value={formData.learningLanguage}
                          onChange={(e) => setFormData({ ...formData, learningLanguage: e.target.value })}
                          className="select select-bordered w-full"
                        >
                          <option value="">Select learning language</option>
                          <option value="english">English</option>
                          <option value="spanish">Spanish</option>
                          <option value="french">French</option>
                          <option value="german">German</option>
                          <option value="italian">Italian</option>
                          <option value="portuguese">Portuguese</option>
                          <option value="russian">Russian</option>
                          <option value="chinese">Chinese</option>
                          <option value="japanese">Japanese</option>
                          <option value="korean">Korean</option>
                          <option value="arabic">Arabic</option>
                          <option value="hindi">Hindi</option>
                        </select>
                      ) : (
                        <div className="flex items-center gap-2">
                          {getLanguageFlag(authUser.learningLanguage)}
                          <span className="capitalize">{authUser.learningLanguage || "Not specified"}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Coding Platforms */}
                <div className="space-y-4">
  <h3 className="text-lg font-semibold">Coding Platforms</h3>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {/* GitHub */}
    <div>
      <label className="label">
        <span className="label-text font-medium">GitHub</span>
      </label>
      {isEditing ? (
        <input
          type="text"
          value={formData.github}
          onChange={(e) => setFormData({ ...formData, github: e.target.value })}
          className="input input-bordered w-full"
          placeholder="GitHub username"
        />
      ) : (
        <div className="flex items-center gap-2 break-words max-w-full">
          <GlobeIcon className="h-4 w-4 opacity-70 flex-shrink-0" />
          <span className="truncate break-all">{authUser.githubUrl || "Not specified"}</span>
        </div>
      )}
    </div>

    {/* LeetCode */}
    <div>
      <label className="label">
        <span className="label-text font-medium">LeetCode</span>
      </label>
      {isEditing ? (
        <input
          type="text"
          value={formData.leetcode}
          onChange={(e) => setFormData({ ...formData, leetcode: e.target.value })}
          className="input input-bordered w-full"
          placeholder="LeetCode username"
        />
      ) : (
        <div className="flex items-center gap-2 break-words max-w-full">
          <BookOpenIcon className="h-4 w-4 opacity-70 flex-shrink-0" />
          <span className="truncate break-all">{authUser.leetcodeUrl || "Not specified"}</span>
        </div>
      )}
    </div>

    {/* Codeforces */}
    <div>
      <label className="label">
        <span className="label-text font-medium">Codeforces</span>
      </label>
      {isEditing ? (
        <input
          type="text"
          value={formData.codeforces}
          onChange={(e) => setFormData({ ...formData, codeforces: e.target.value })}
          className="input input-bordered w-full"
          placeholder="Codeforces username"
        />
      ) : (
        <div className="flex items-center gap-2 break-words max-w-full">
          <BookOpenIcon className="h-4 w-4 opacity-70 flex-shrink-0" />
          <span className="truncate break-all">{authUser.codeforcesUrl || "Not specified"}</span>
        </div>
      )}
    </div>
  </div>
</div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 