using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Dtos;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface ILikesRepository
    {
        Task<UserLike?> GetUserLike(int sourceUserId, int targetUserId);
        Task<IEnumerable<int>> GetCurrentUserLikeIds(int currentUserId);
        Task<PagedList<MemberDto>> GetUserLikes(LikesParams likesParams);

        void DeleteLike(UserLike like);
        void AddLike(UserLike like);
    }
}