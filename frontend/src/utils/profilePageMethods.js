export const handlePostDelete = (setUserData) => {
    setUserData((prev) => ({
      ...prev,
      postsCount: prev.postsCount === 0 ? 0 : prev.postsCount - 1,
    }));
  };

 export const handleRemoveFollowerProfile = (setUserData) => {
    setUserData((prev) => ({
      ...prev,
      followersCount: prev.followersCount === 0 ? 0 : prev.followersCount - 1,
    }));
  };

 export const handleRemoveFollowingPrfoile = (setUserData) => {
    setUserData((prev) => ({
      ...prev,
      followingsCount: prev.followingsCount === 0 ? 0 : prev.followingsCount - 1,
    }));
  };