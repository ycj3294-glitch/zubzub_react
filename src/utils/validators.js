// src/utils/validators.js

// 이메일
export const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

// 비밀번호 (8자 이상, 영문+숫자)
export const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

// 닉네임 (2~10자, 한글/영문/숫자)
export const nicknameRegex = /^[가-힣A-Za-z0-9]{2,10}$/;
