using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Dtos;
using API.Entities;
using API.Helpers;
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
        public async Task<PagedList<MemberDto>> GetUserLikes(LikesParams likesParams)
        {
            var likes = dataContext.Likes.AsQueryable();
            IQueryable<MemberDto> query;

            switch (likesParams.Predicate)
            {
                case "liked":
                    query =  likes
                    .Where(x => x.SourceUserId == likesParams.UserId)
                    .Select(x => x.LikedUser)
                    .ProjectTo<MemberDto>(mapper.ConfigurationProvider);
                break;
                case "likedBy":
                    query =  likes
                    .Where(x => x.LikedUserId == likesParams.UserId)
                    .Select(x => x.SourceUser)
                    .ProjectTo<MemberDto>(mapper.ConfigurationProvider);
                break;
                default:
                    var likeIds = await GetCurrentUserLikeIds(likesParams.UserId);
                    query = likes
                    .Where(x => x.LikedUserId == likesParams.UserId && likeIds.Contains(x.SourceUserId))
                    .Select(x => x.SourceUser)
                    .ProjectTo<MemberDto>(mapper.ConfigurationProvider);
                break;
            }
            return await PagedList<MemberDto>.CreateAsync(query, likesParams.PageNumber, likesParams.PageSize);
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