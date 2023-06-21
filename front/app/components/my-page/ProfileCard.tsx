"use client";

import styled from "styled-components";
import Button from "../../components/UI/Button";
import { Recipe, User } from "@/app/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getRecipeByUserId } from "@/app/api/recipe";
import getCurrentUser from "@/app/api/user";
import { useRouter } from "next/navigation";
import Image from "next/image";

type MemoItemProps = {
  created_at: string;
  recipe_id: string;
  recipe_like: number;
  recipe_thumbnail: string;
  recipe_title: string;
  recipe_view: number;
  user_id: string;
  user_nickname: string;
};

type ScrapItemProps = {
  scrapData: MemoItemProps;
  memo: string;
  user_id: string;
};

const ProfileCard = () => {
  // 캐시에 저장된 현재 유저정보를 가져옴
  const { data: currentUser } = useQuery<User>(["currentUser"], () =>
    getCurrentUser()
  );

  // 캐시에 저장된 현재 유저가 작성한 레시피들을 가져옴
  const { data: currentUserRecipes } = useQuery<Recipe[]>(
    ["currentUserRecipes"],
    () => getRecipeByUserId()
  );

  const [parsedMemo, setParsedMemo] = useState<ScrapItemProps[]>([]);

  const router = useRouter();

  // 나의 스크랩 개수 추출을 위한 parsedMemo 정의
  useEffect(() => {
    if (typeof window !== "undefined") {
      const existingMemo = localStorage.getItem("scrapMemo");
      const parsedMemo = existingMemo ? JSON.parse(existingMemo) : [];
      const currentUserMemo = parsedMemo.filter(
        (item: ScrapItemProps) => item.user_id === currentUser?.user_id
      );
      setParsedMemo(currentUserMemo);
    }
  }, []);

  return (
    <ProfileContainer>
      <ProfileWrapper>
        <ProfileBox>
          <ImageAndNickName>
            <RoundImage>
              <Image
                src={currentUser?.img || "/images/dongs-logo.png"}
                height={120}
                width={120}
                style={{ objectFit: "cover" }}
                alt="profile-image"
              />
            </RoundImage>
            <NickName>{currentUser?.username}</NickName>
          </ImageAndNickName>
          <ProfileContentsBox>
            <FollowAndFollowing>
              <FollowerAndCount>
                <Follower>팔로워</Follower>
                <FollowerCount>{currentUser?.fans.length}</FollowerCount>
              </FollowerAndCount>
              <FollowDivider />
              <FollowingAndCount>
                <Following>팔로잉</Following>
                <FollowingCount>
                  {currentUser?.subscriptions.length}
                </FollowingCount>
              </FollowingAndCount>
            </FollowAndFollowing>

            <LinkBtn
              onClick={() => {
                router.push("/my-page/modify-user-info");
              }}
            >
              <ModifyUserButtonWrapper>
                <Button
                  isBorderColor={true}
                  fullWidth={true}
                  fullHeight={true}
                  isMediumFont={true}
                  isHoverColor={true}
                >
                  회원정보수정
                </Button>
              </ModifyUserButtonWrapper>
            </LinkBtn>
            <Divider />

            {/* 나의 레시피 버튼 */}
            <RecipeAndScrapButtonWrapper>
              <LinkBtn
                onClick={() => {
                  router.push("/my-page");
                }}
              >
                <MyRecipeIcon
                  src="/images/my-page/my_recipe.svg"
                  alt="레시피 아이콘"
                />
                <MyRecipeTitle>My 레시피</MyRecipeTitle>
                <MyRecipeCount>{currentUserRecipes?.length}</MyRecipeCount>
              </LinkBtn>

              {/* 나의 스크랩 버튼 */}
              <LinkBtn
                onClick={() => {
                  router.push("/my-page/scrap");
                }}
              >
                <MyRecipeIcon
                  src="/images/recipe-view/scrap_full.svg"
                  alt="스크랩 아이콘"
                />
                <MyRecipeTitle>My 스크랩</MyRecipeTitle>
                <MyRecipeCount>{parsedMemo.length}</MyRecipeCount>
              </LinkBtn>
            </RecipeAndScrapButtonWrapper>
          </ProfileContentsBox>
        </ProfileBox>

        <LinkBtn
          onClick={() => {
            router.push("/add-recipe");
          }}
        >
          <UploadRecipeButtonWrapper>
            <Button
              type="button"
              isBgColor={true}
              fullWidth={true}
              isBorderColor={false}
              isHoverColor={false}
            >
              레시피 올리기
            </Button>
          </UploadRecipeButtonWrapper>
        </LinkBtn>
      </ProfileWrapper>
    </ProfileContainer>
  );
};

export default ProfileCard;

const ProfileContainer = styled.div`
  height: 23.7rem;
  border-bottom: 0.1rem solid rgb(200, 200, 200);
  @media (min-width: 1024px) {
    border: 0.1rem solid rgb(200, 200, 200);
    border-radius: 2.3rem;
    box-shadow: rgba(63, 71, 77, 0.06) 0px 0.2rem 0.4rem 0px;
    border-radius: 2.3rem;
    height: 49.5rem;
    margin-right: 4rem;
    margin-top: 4.1rem;
  }
`;

const ProfileWrapper = styled.div`
  width: 100%;
  padding: 2.9rem 0 1.5rem;
  @media (min-width: 1024px) {
    position: relative;
    padding: 3rem 2.5rem 1.8rem;
    width: 26.8rem;
    height: 47.8rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const ProfileBox = styled.div`
  display: flex;
  gap: 2.5rem;
  justify-content: center;
  align-items: end;
  margin-bottom: 0.5rem;
  @media (min-width: 1024px) {
    flex-direction: column;
    align-items: center;
    gap: 0;
    margin-bottom: 0;
  }
`;

const ImageAndNickName = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 0.5rem;
  @media (min-width: 1024px) {
    gap: 0;
  }
`;

const RoundImage = styled.div`
  display: flex;
  width: 8.7rem;
  height: 8.7rem;
  border-radius: 50%;
  overflow: hidden;
  @media (min-width: 1024px) {
    width: 12rem;
    height: 12rem;
  }
`;

const NickName = styled.h1`
  font-size: 17px;
  font-weight: 600;
  margin-bottom: 2rem;
  color: #4f3d21;
  @media (min-width: 1024px) {
    font-size: 26px;
    margin: 1rem;
  }
`;

const ProfileContentsBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.1rem;

  @media (min-width: 1024px) {
    align-items: center;
  }
`;

const FollowAndFollowing = styled.div`
  display: flex;
  padding: 0 0.5rem 0.5rem;
  margin-bottom: 0.8rem;
`;

const FollowerAndCount = styled.div`
  display: flex;
  gap: 0.4rem;
`;

const Follower = styled.h4`
  font-size: 14px;
  font-weight: 550;
  color: #4f3d21;
`;

const FollowerCount = styled.h4`
  font-size: 14px;
  font-weight: 500;
  color: #4f3d21;
`;

const FollowDivider = styled.div`
  border-left: 1px solid black;
  height: 2.5em;
  display: inline-block;
  margin: 0.2rem 0.8rem 0;
  color: #4f3d21;
`;

const FollowingAndCount = styled.div`
  display: flex;
  gap: 0.4rem;
`;

const Following = styled.h4`
  font-size: 14px;
  font-weight: 550;
  color: #4f3d21;
`;

const FollowingCount = styled.h4`
  font-size: 14px;
  font-weight: 500;
  color: #4f3d21;
`;

const ModifyUserButtonWrapper = styled.div`
  display: none;
  @media (min-width: 1024px) {
    display: flex;
    width: 12rem;
  }
`;

const Divider = styled.div`
  @media (min-width: 1024px) {
    display: flex;
    width: 20rem;
    height: 1px;
    background-color: #ccc;
    margin: 2rem 0;
  }

  @media (max-width: 1023px) {
    display: none;
  }
`;

const RecipeAndScrapButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.8rem;
  margin-bottom: 2rem;
  @media (min-width: 1024px) {
    margin: 0;
  }
`;

const MyRecipeIcon = styled.img`
  width: 2.8rem;
  height: 2.8rem;
`;

const MyRecipeTitle = styled.h4`
  font-size: 13px;
  font-weight: 550;
  color: #4f3d21;
`;

const MyRecipeCount = styled.h4`
  font-size: 15px;
  font-weight: 500;
  color: #4f3d21;
  @media (min-width: 1024px) {
    font-size: 18px;
    font-weight: 600;
  }
`;

const UploadRecipeButtonWrapper = styled.div`
  width: 100%;
  @media (min-width: 1024px) {
    margin-top: 1.8rem;
    width: 14rem;
  }
`;

const LinkBtn = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  flex-direction: column;
`;






