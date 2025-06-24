import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import axios from 'axios';

export const useLikeDislike = () => {
  const navigate = useNavigate();
  const [likeStatus, setLikeStatus] = useState({});
  const [likeCount, setLikeCount] = useState({});
  const [dislikeStatus, setDislikeStatus] = useState({});
  const [dislikeCount, setDislikeCount] = useState({});

  const refreshLikeDislikeStatus = async (itemId, type) => {
    const key = `${type}-${itemId}`;
    const user = authService.getCurrentUser();
    const headers = user ? { Authorization: `Bearer ${user.token}` } : {};

    try {
      const likeRes = await axios.get(`/${type}-likes/${itemId}/has-liked`, { headers });
      setLikeStatus(prev => ({ ...prev, [key]: likeRes.data.hasLiked }));
      const likeCountRes = await axios.get(`/${type}-likes/${itemId}/count`);
      setLikeCount(prev => ({ ...prev, [key]: likeCountRes.data.count }));

      const dislikeRes = await axios.get(`/${type}-dislikes/${itemId}/has-disliked`, { headers });
      setDislikeStatus(prev => ({ ...prev, [key]: dislikeRes.data.hasDisliked }));
      const dislikeCountRes = await axios.get(`/${type}-dislikes/${itemId}/count`);
      setDislikeCount(prev => ({ ...prev, [key]: dislikeCountRes.data.count }));
    } catch (e) {}
  };

  const handleLike = async (itemId, type) => {
    const user = authService.getCurrentUser();
    if (!user) {
      alert('請先登入');
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
  
    const headers = { Authorization: `Bearer ${user.token}` };
    const key = `${type}-${itemId}`;
    const isLiked = likeStatus[key];
    const isDisliked = dislikeStatus[key];
  
    try {
      if (isLiked) {
        await axios.post(`/${type}-likes/${itemId}/unlike`, {}, { headers });
        setLikeStatus(prev => ({ ...prev, [key]: false }));
        setLikeCount(prev => ({ ...prev, [key]: Math.max((prev[key] || 1) - 1, 0) }));
      } else {
        if (isDisliked) {
          await axios.post(`/${type}-dislikes/${itemId}/undislike`, {}, { headers });
          setDislikeStatus(prev => ({ ...prev, [key]: false }));
          setDislikeCount(prev => ({ ...prev, [key]: Math.max((prev[key] || 1) - 1, 0) }));
        }
        await axios.post(`/${type}-likes/${itemId}/like`, {}, { headers });
        setLikeStatus(prev => ({ ...prev, [key]: true }));
        setLikeCount(prev => ({ ...prev, [key]: (prev[key] || 0) + 1 }));
      }
    } catch (error) {
      console.error('按讚操作失敗:', error);
      if (error.response?.status === 401) {
        alert('登入已過期，請重新登入');
        authService.logout();
        navigate('/login');
      } else if (error.response?.status === 403) {
        alert('權限不足');
      } else {
        alert('操作失敗，請稍後再試');
      }
    }
  };

  const handleDislike = async (itemId, type) => {
    const user = authService.getCurrentUser();
    if (!user) {
      alert('請先登入');
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
  
    const headers = { Authorization: `Bearer ${user.token}` };
    const key = `${type}-${itemId}`;
    const isLiked = likeStatus[key];
    const isDisliked = dislikeStatus[key];
  
    try {
      if (isDisliked) {
        await axios.post(`/${type}-dislikes/${itemId}/undislike`, {}, { headers });
        setDislikeStatus(prev => ({ ...prev, [key]: false }));
        setDislikeCount(prev => ({ ...prev, [key]: Math.max((prev[key] || 1) - 1, 0) }));
      } else {
        if (isLiked) {
          await axios.post(`/${type}-likes/${itemId}/unlike`, {}, { headers });
          setLikeStatus(prev => ({ ...prev, [key]: false }));
          setLikeCount(prev => ({ ...prev, [key]: Math.max((prev[key] || 1) - 1, 0) }));
        }
        await axios.post(`/${type}-dislikes/${itemId}/dislike`, {}, { headers });
        setDislikeStatus(prev => ({ ...prev, [key]: true }));
        setDislikeCount(prev => ({ ...prev, [key]: (prev[key] || 0) + 1 }));
      }
    } catch (error) {
      console.error('倒讚操作失敗:', error);
      if (error.response?.status === 401) {
        alert('登入已過期，請重新登入');
        authService.logout();
        navigate('/login');
      } else if (error.response?.status === 403) {
        alert('權限不足');
      } else {
        alert('操作失敗，請稍後再試');
      }
    }
  };

  return {
    likeStatus,
    setLikeStatus,
    likeCount,
    setLikeCount,
    dislikeStatus,
    setDislikeStatus,
    dislikeCount,
    setDislikeCount,
    handleLike,
    handleDislike,
    refreshLikeDislikeStatus
  };
}; 