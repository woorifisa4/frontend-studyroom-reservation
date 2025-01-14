import React, { useState, useCallback, useEffect } from 'react';
import { Calendar, Clock, User, Layout, X, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { reservationApi } from '../api/reservationApi';
import { userApi } from '../api/userApi';
import debounce from 'lodash/debounce';
import Button from '../ui/Button';
import { formatDateToKorean, formatTime } from '../utils/date';

/**
 * @typedef {Object} User
 * @property {string} id - 사용자 고유 ID
 * @property {string} name - 사용자 이름
 * @property {string} email - 사용자 이메일
 */

/**
 * @typedef {Object} PlannedReservation
 * @property {string} room - 예약할 강의실/테이블 번호
 * @property {string} start - 시작 시간 (HH:mm 형식)
 * @property {string} end - 종료 시간 (HH:mm 형식)
 */

/**
 * 강의실 예약 정보를 표시하고 관리하는 컴포넌트
 * @param {Object} props
 * @param {User} props.user - 현재 로그인한 사용자 정보
 * @param {Date} props.selectedDate - 선택된 예약 날짜
 * @param {PlannedReservation} props.plannedReservation - 예약 계획 정보
 * @param {Function} props.setPlannedReservation - 예약 계획 정보 설정 함수
 * @param {Function} props.setReservations - 전체 예약 목록 설정 함수
 */
const ReservationInfo = ({
  user,
  selectedDate,
  plannedReservation,
  setPlannedReservation,
  setReservations
}) => {
  const [reservationDescription, setReservationDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [participantSearchKeyword, setParticipantSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  /**
   * 참여자 조회를 위한 사용자 검색 함수
   */
  const debouncedUserSearch = useCallback(
    debounce(async (keyword) => {
      if (!keyword.trim()) { // 검색어가 없으면 검색 결과 초기화
        setSearchResults([]);
        return;
      }

      setIsSearching(true); // 검색 중임을 표시

      try {
        const response = await userApi.search(keyword);

        // 현재 사용자와 이미 선택된 참여자는 검색 결과에서 제외
        const filteredUsers = response.data.users.filter(searchedUser =>
          searchedUser.id !== user.id &&
          !selectedParticipants.some(participant => participant.id === searchedUser.id)
        );

        setSearchResults(filteredUsers); // 검색 결과 설정

      } catch (error) {

        // Todo: 토글로 변경
        console.error('참여자 검색 중 오류 발생:', error);
        setSearchResults([]);

      } finally {
        setIsSearching(false); // 검색 완료
      }

    }, 150), // 150ms 디바운스
    [user.id, selectedParticipants] // 사용자 ID와 선택된 참여자 목록이 변경될 때만 재설정
  );

  // 검색어가 변경될 때마다 검색 실행
  useEffect(() => {
    debouncedUserSearch(participantSearchKeyword);
  }, [participantSearchKeyword, debouncedUserSearch]);

  /**
   * 새로운 예약을 생성하는 핸들러
   */
  const handleReservationSubmit = async () => {
    if (!user || !plannedReservation || isSubmitting) return;

    try {
      setIsSubmitting(true);

      // 예약 생성 API 호출
      const requestDto = {
        room: plannedReservation.room,
        date: selectedDate,
        start: plannedReservation.start,
        end: plannedReservation.end,
        description: reservationDescription,
        reserverId: user.id,
        participants: selectedParticipants.map(participant => participant.id)
      };

      await reservationApi.create(requestDto);

      // 예약 목록 새로고침
      const { data } = await reservationApi.getByDate(
        selectedDate.toISOString().split('T')[0]
      );
      setReservations(data);

      // 폼 초기화
      setPlannedReservation(null);
      setReservationDescription("");

      // TODO: 토글로 변경
      alert("강의실 예약이 완료되었습니다.");

    } catch (error) {
      console.error('예약 생성 실패:', error);

      // TODO: 토글로 변경
      alert("예약 처리 중 오류가 발생했습니다. 다시 시도해 주세요.");

    } finally {
      setIsSubmitting(false);
    }
  };

  const handleParticipantSelect = (participant) => {
    if (!selectedParticipants.some(p => p.id === participant.id)) {
      setSelectedParticipants([...selectedParticipants, participant]);
    }
    setParticipantSearchKeyword('');
    setSearchResults([]);
  };

  const removeParticipant = (participantId) => {
    setSelectedParticipants(selectedParticipants.filter(p => p.id !== participantId));
  };

  // 입력 핸들러 수정
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setParticipantSearchKeyword(value);
    if (!value.trim()) {
      setSearchResults([]);
      return;
    }
    // 즉시 검색 실행
    debouncedUserSearch(value);
  };

  const infoItems = [
    {
      icon: <User size={20} />,
      label: "예약자",
      value: user.name
    },
    {
      icon: <Calendar size={20} />,
      label: "예약 날짜",
      value: formatDateToKorean(selectedDate)
    },
    {
      icon: <Clock size={20} />,
      label: "예약 시간",
      value: `${formatTime(plannedReservation.start)} ~ ${formatTime(plannedReservation.end, selectedDate)}`
    },
    {
      icon: <Layout size={20} />,
      label: "테이블",
      value: plannedReservation.room
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6"
    >
      {/* 그라데이션 배경의 헤더 */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          예약 정보
        </h2>
        <button
          onClick={() => setPlannedReservation(null)}
          className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200"
        >
          <X size={20} className="text-gray-500 hover:text-gray-700" />
        </button>
      </div>

      <div className="space-y-5">
        {/* 그라데이션이 적용된 정보 아이템들 */}
        {infoItems.map(({ icon, label, value }) => (
          <div key={label}
            className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-blue-100 transition-all duration-200">
            <div className="text-blue-500 mr-4">{icon}</div>
            <div className="flex-1">
              <div className="text-sm text-gray-500 mb-0.5">{label}</div>
              <div className="font-semibold text-gray-800">{value}</div>
            </div>
          </div>
        ))}

        {/* 모던한 디자인의 참여자 섹션 */}
        <div className="mt-6">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Users size={20} className="text-blue-500" />
            <span>참여자</span>
          </label>

          {/* 선택된 참여자 태그 */}
          {selectedParticipants.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedParticipants.map((participant) => (
                <div
                  key={participant.id}
                  className="group relative inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-full hover:from-blue-100 hover:to-blue-200 transition-all duration-200"
                >
                  <span className="text-sm font-medium">{participant.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeParticipant(participant.id);
                    }}
                    className="opacity-60 hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 모던한 스타일의 검색 입력창 */}
          <div className="relative">
            <input
              type="text"
              value={participantSearchKeyword}
              onChange={handleSearchChange}
              placeholder="이름으로 참여자 검색"
              className="w-full p-3 pl-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-400 border-t-transparent"></div>
              </div>
            )}

            {/* 향상된 스타일의 검색 결과 */}
            {searchResults.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-200"
                    onClick={() => handleParticipantSelect(result)}
                  >
                    <div className="font-medium text-gray-900">{result.name}</div>
                    <div className="text-sm text-gray-500">{result.email}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 예약 사유 입력 */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">예약 사유</label>
          <textarea
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-300 resize-none transition-all duration-200"
            rows="3"
            value={reservationDescription}
            onChange={(e) => setReservationDescription(e.target.value)}
            placeholder="예약 사유를 입력해 주세요. (예: CS 스터디)"
          />
        </div>

        {/* 예약하기 버튼 */}
        <Button
          onClick={handleReservationSubmit}
          disabled={isSubmitting}
          variant="primary"
          fullWidth
        >
          {isSubmitting ? '예약 중...' : '예약하기'}
        </Button>
      </div>
    </motion.div>
  );
};

export default ReservationInfo;