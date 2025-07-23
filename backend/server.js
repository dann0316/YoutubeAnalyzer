"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const PORT = 3000;
app.use(cors());
// 영상 길이에 따른 예상 시청 지속율 계산 함수
function getEstimatedWatchTimeRate(videoLength) {
    if (videoLength <= 180) {
        // 3분 이하
        return 0.6;
    }
    else if (videoLength <= 600) {
        // 10분 이하
        return 0.5;
    }
    else if (videoLength <= 1200) {
        // 20분 이하
        return 0.4;
    }
    else {
        return 0.3;
    }
}
// ✅ 업로드 시간 가중치 (18시~21시 업로드 시 가산점)
function getUploadTimeBonus(publishedAt) {
    const hour = new Date(publishedAt).getHours();
    return hour >= 18 && hour <= 21 ? 5 : 0;
}
// 성과도 계산 함수
function calculatePerformanceScore(views, subscribers, daysSincePosted, likes, comments, averageViewDuration, videoLength, title, keyword, publishedAt) {
    const speedScore = Math.min((views / daysSincePosted) * 0.002, 30);
    const retentionRate = (averageViewDuration / videoLength) * 100;
    const retentionScore = Math.min(retentionRate * 0.2, 20);
    const engagementScore = Math.min(((likes + comments * 2) / views) * 100 * 0.2, 20);
    const viewToSubscriberScore = Math.min((views / subscribers) * 20, 20);
    const keywordMatchScore = title.includes(keyword) ? 5 : 0;
    const timeBonus = getUploadTimeBonus(publishedAt);
    return Math.round(speedScore +
        retentionScore +
        engagementScore +
        viewToSubscriberScore +
        keywordMatchScore +
        timeBonus);
}
// YouTube 영상 검색 API + 성과도 계산
app.get("/api/videos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { keyword, pageToken } = req.query;
        if (!keyword) {
            return res
                .status(400)
                .json({ error: "검색할 키워드를 입력하세요." });
        }
        const API_KEY = process.env.YOUTUBE_API_KEY;
        // 🔹 검색 API 호출
        const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(keyword)}&type=video&maxResults=10&key=${API_KEY}&pageToken=${pageToken || ""}`;
        const searchResponse = yield axios.get(searchUrl);
        // 🔹 제목에 정확히 키워드가 포함된 것만 필터링 -> 정규식으로?
        const filteredItems = searchResponse.data.items.filter((item) => item.snippet.title.includes(keyword));
        // 🔹 필터링된 영상들의 상세 데이터 요청
        const videoIds = filteredItems.map((item) => item.id.videoId).join(",");
        if (!videoIds) {
            return res.json({
                videos: [],
                nextPageToken: searchResponse.data.nextPageToken || null,
            });
        }
        const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoIds}&key=${API_KEY}`;
        const detailsResponse = yield axios.get(detailsUrl);
        // 🔹 성과도 계산 및 데이터 구성
        const videos = filteredItems.map((item) => {
            const details = detailsResponse.data.items.find((d) => d.id === item.id.videoId);
            const statistics = (details === null || details === void 0 ? void 0 : details.statistics) || {};
            const contentDetails = (details === null || details === void 0 ? void 0 : details.contentDetails) || {};
            const views = parseInt(statistics.viewCount || "0");
            const likes = parseInt(statistics.likeCount || "0");
            const comments = parseInt(statistics.commentCount || "0");
            const videoLength = convertDurationToSeconds(contentDetails.duration || "PT0S");
            const daysSincePosted = getDaysSincePosted(item.snippet.publishedAt);
            const estimatedWatchTimeRate = getEstimatedWatchTimeRate(videoLength);
            const averageViewDuration = videoLength * estimatedWatchTimeRate;
            const performanceScore = calculatePerformanceScore(views, 10000, daysSincePosted, likes, comments, averageViewDuration, videoLength, item.snippet.title, keyword, item.snippet.publishedAt);
            return {
                videoId: item.id.videoId,
                title: item.snippet.title,
                description: item.snippet.description,
                thumbnail: item.snippet.thumbnails.high.url,
                publishedAt: item.snippet.publishedAt,
                channelTitle: item.snippet.channelTitle,
                channelId: item.snippet.channelId,
                views,
                likes,
                comments,
                videoLength,
                performanceScore,
            };
        });
        // 🔹 조회수 기준 정렬
        videos.sort((a, b) => b.views - a.views);
        res.json({
            videos,
            nextPageToken: searchResponse.data.nextPageToken || null,
        });
    }
    catch (error) {
        console.error("❌ 서버 오류:", error);
        res.status(500).json({
            error: "서버 오류 발생",
            details: error.message,
        });
    }
}));
// 유튜브 영상 길이 변환 (PnDTnHnMnS → 초)
function convertDurationToSeconds(duration) {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match)
        return 0;
    const hours = match[1] ? parseInt(match[1]) : 0;
    const minutes = match[2] ? parseInt(match[2]) : 0;
    const seconds = match[3] ? parseInt(match[3]) : 0;
    return hours * 3600 + minutes * 60 + seconds;
}
// 업로드 후 경과 일수 계산
function getDaysSincePosted(publishedAt) {
    const publishedDate = new Date(publishedAt);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - publishedDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
// 검색 자동완성 API
app.get("/api/autocomplete", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { keyword } = req.query;
        if (!keyword) {
            return res.status(400).json({ error: "검색어를 입력하세요." });
        }
        const suggestUrl = `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=${encodeURIComponent(keyword)}`;
        const response = yield axios.get(suggestUrl);
        const suggestions = response.data[1] || [];
        res.json({ suggestions });
    }
    catch (error) {
        console.error("❌ 자동완성 API 오류:", error);
        res.status(500).json({
            error: "자동완성 데이터를 가져오는 중 오류 발생",
            details: error.message,
        });
    }
}));
// 베스트 댓글 API
app.get("/api/comments", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const videoId = req.query.videoId;
    if (!videoId) {
        return res.status(400).json({ error: 'videoId 쿼리 파라미터가 필요합니다.' });
    }
    try {
        const response = yield axios.get(`https://www.googleapis.com/youtube/v3/commentThreads`, {
            params: {
                part: 'snippet',
                videoId: videoId,
                order: 'relevance',
                maxResults: 50,
                key: process.env.YOUTUBE_API_KEY,
            },
        });
        const items = response.data.items;
        if (!items || items.length === 0) {
            return res.status(404).json({ message: '댓글이 없습니다.' });
        }
        // 가장 좋아요 많은 댓글 찾기
        let bestComment = items[0].snippet.topLevelComment.snippet;
        for (const item of items) {
            const current = item.snippet.topLevelComment.snippet;
            if (current.likeCount > bestComment.likeCount) {
                bestComment = current;
            }
        }
        res.json({
            author: bestComment.authorDisplayName,
            text: bestComment.textDisplay,
            likeCount: bestComment.likeCount,
            publishedAt: bestComment.publishedAt,
        });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'YouTube API 요청 실패' });
    }
}));
// 채널 정보 가져오기
app.get("/api/channel", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const channelId = req.query.id;
    if (!channelId) {
        return res.status(400).json({ error: "채널 ID가 필요합니다." });
    }
    try {
        const response = yield axios.get("https://www.googleapis.com/youtube/v3/channels", {
            params: {
                part: "snippet,statistics",
                id: channelId,
                key: process.env.YOUTUBE_API_KEY,
                // 이걸 그냥 snippect.channelId 이렇게 써도 되는거잖아
            },
        });
        const items = response.data.items;
        if (!items || items.length === 0) {
            return res.status(404).json({ message: "채널 정보를 찾을 수 없습니다." });
        }
        const channel = items[0];
        const snippet = channel.snippet;
        const statistics = channel.statistics;
        res.json({
            id: channel.id,
            title: snippet.title,
            description: snippet.description,
            thumbnail: (_b = (_a = snippet.thumbnails) === null || _a === void 0 ? void 0 : _a.default) === null || _b === void 0 ? void 0 : _b.url,
            publishedAt: snippet.publishedAt,
            subscriberCount: statistics.subscriberCount,
            videoCount: statistics.videoCount,
            viewCount: statistics.viewCount,
        });
    }
    catch (error) {
        console.error("YouTube API 요청 실패:", error.message);
        res.status(500).json({ error: "YouTube API 요청 실패" });
    }
}));
// 뉴스 검색 API
app.get("/api/news", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req.query;
    if (!query || typeof query !== "string") {
        return res.status(400).json({ message: "검색어(query)를 query string으로 전달해야 합니다." });
    }
    try {
        const response = yield axios.get("https://openapi.naver.com/v1/search/news.json", {
            params: {
                query: query,
                display: 10, // 10개씩 가져오기
                start: 1, // 1페이지부터
                sort: "date" // 최신순: date | 정확도순: sim
            },
            headers: {
                "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID,
                "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET
            }
        });
        res.status(200).json(response.data);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "네이버 뉴스 API 호출 실패", error: err.message });
    }
}));
// ✅ 서버 실행
app.listen(PORT, '0.0.0.0', () => {
    console.log(`서버 실행 중: ${PORT}`);
});
