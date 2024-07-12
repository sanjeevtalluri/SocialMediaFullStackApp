using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Dtos;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class LikesRepository : ILikesRepository
    {
        private readonly DataContext dataContext;
        private readonly IMapper mapper;

        public LikesRepository(DataContext dataContext, IMapper mapper)
        {
            this.dataContext = dataContext;
            this.mapper = mapper;
        }

        public async Task<UserLike?> GetUserLike(int sourceUserId, int targetUserId)
        {
            return await dataContext.Likes
            .FindAsync(sourceUserId, targetUserId);
        }
        public async Task<IEnumerable<int>> GetCurrentUserLikeIds(int currentUserId)
        {
            return await dataContext.Likes
            .Where(x => x.SourceUserId == currentUserId)
            .Select(x => x.LikedUserId)
            .ToListAsync();
        }
        public async Task<IEnumerable<MemberDto>> GetUserLikes(string predicate, int userId)
        {
            var likes = dataContext.Likes.AsQueryable();

            switch (predicate)
            {
                case "liked":
                    return await likes
                    .Where(x => x.SourceUserId == userId)
                    .Select(x => x.LikedUser)
                    .ProjectTo<MemberDto>(mapper.ConfigurationProvider)
                    .ToListAsync();
                case "likedBy":
                    return await likes
                    .Where(x => x.LikedUserId == userId)
                    .Select(x => x.SourceUser)
                    .ProjectTo<MemberDto>(mapper.ConfigurationProvider)
                    .ToListAsync();
                default:
                    var likeIds = await GetCurrentUserLikeIds(userId);
                    return await likes
                    .Where(x => x.LikedUserId == userId && likeIds.Contains(x.SourceUserId))
                    .Select(x => x.SourceUser)
                    .ProjectTo<MemberDto>(mapper.ConfigurationProvider)
                    .ToListAsync();
            }
        }

        public void DeleteLike(UserLike like)
        {
            dataContext.Likes.Remove(like);
        }
        public void AddLike(UserLike like)
        {
            dataContext.Likes.Add(like);
        }
        public async Task<bool> SaveChanges()
        {
            return await dataContext.SaveChangesAsync()>0;
        }
    }
}