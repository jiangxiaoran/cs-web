/**
 * 时间格式化工具函数
 */

/**
 * 格式化日期时间为 YYYY-MM-DD HH:mm:ss 格式
 * @param date 日期对象或日期字符串
 * @returns 格式化后的时间字符串
 */
export const formatDateTime = (date: Date | string | undefined): string => {
  if (!date) return '-';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return '-';
    }
    
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    const seconds = String(dateObj.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  } catch (error) {
    console.error('时间格式化错误:', error);
    return '-';
  }
};

/**
 * 格式化日期为 YYYY-MM-DD 格式
 * @param date 日期对象或日期字符串
 * @returns 格式化后的日期字符串
 */
export const formatDate = (date: Date | string | undefined): string => {
  if (!date) return '-';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return '-';
    }
    
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('日期格式化错误:', error);
    return '-';
  }
};

/**
 * 格式化时间为 HH:mm:ss 格式
 * @param date 日期对象或日期字符串
 * @returns 格式化后的时间字符串
 */
export const formatTime = (date: Date | string | undefined): string => {
  if (!date) return '-';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return '-';
    }
    
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    const seconds = String(dateObj.getSeconds()).padStart(2, '0');
    
    return `${hours}:${minutes}:${seconds}`;
  } catch (error) {
    console.error('时间格式化错误:', error);
    return '-';
  }
};

/**
 * 格式化持续时间（秒）为可读格式
 * @param seconds 秒数
 * @returns 格式化后的持续时间字符串
 */
export const formatDuration = (seconds: number | undefined): string => {
  // 检查是否为有效数字
  if (!seconds || seconds <= 0 || isNaN(seconds) || !isFinite(seconds)) {
    return '-';
  }
  
  if (seconds < 60) {
    return `${seconds}秒`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}分${remainingSeconds}秒`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}时${minutes}分${remainingSeconds}秒`;
  }
};

/**
 * 获取相对时间描述（如：刚刚、5分钟前、1小时前等）
 * @param date 日期对象或日期字符串
 * @returns 相对时间描述
 */
export const getRelativeTime = (date: Date | string | undefined): string => {
  if (!date) return '-';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return '-';
    }
    
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffSeconds < 60) {
      return '刚刚';
    } else if (diffMinutes < 60) {
      return `${diffMinutes}分钟前`;
    } else if (diffHours < 24) {
      return `${diffHours}小时前`;
    } else if (diffDays < 7) {
      return `${diffDays}天前`;
    } else {
      return formatDate(dateObj);
    }
  } catch (error) {
    console.error('相对时间计算错误:', error);
    return '-';
  }
};
