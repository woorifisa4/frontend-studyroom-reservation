import React, {useState, useCallback, useEffect} from 'react';
import {Calendar, Clock, User, Layout, X, Users} from 'lucide-react';
import {motion} from 'framer-motion';
import {createReservation} from '../api/createReservation';
import {fetchReservations} from '../api/fetchReservations';
import {searchUsers} from '../api/searchUsers';
import debounce from 'lodash/debounce';

const ReservationInfo = ({user, selectedDate, plannedReservation, setPlannedReservation, setReservations}) => {
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedParticipants, setSelectedParticipants] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const debouncedSearch = useCallback(
        debounce(async (keyword) => {
            if (!keyword.trim()) {
                setSearchResults([]);
                return;
            }
            setIsSearching(true);
            try {
                const results = await searchUsers(keyword);

                // 본인과 이미 선택된 참여자 제외
                const filteredResults = results.data.users.filter(r => 
                    r.id !== user.id && 
                    !selectedParticipants.some(p => p.id === r.id)
                );

                setSearchResults(filteredResults);

            } catch (error) {
                console.error('사용자 검색 중 오류:', error);
                setSearchResults([]);

            } finally {
                setIsSearching(false);
            }
        }, 150),
        [user.id, selectedParticipants]
    );

    useEffect(() => {
        debouncedSearch(searchKeyword);
    }, [searchKeyword, debouncedSearch]);

    const formatDate = useCallback((date) => {
        if (!date) return '';
        const parsedDate = new Date(date);
        return parsedDate instanceof Date && !isNaN(parsedDate)
            ? parsedDate.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                weekday: 'short',
            })
            : '';
    }, []);

    const formatTime = useCallback((timeString) => {
        if (!timeString || !selectedDate) return '';
        const [hours, minutes] = timeString.split(':');
        const date = new Date(selectedDate);
        date.setHours(parseInt(hours), parseInt(minutes));
        return date.toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    }, [selectedDate]);

    const handleCreateReservation = async () => {
        if (!user || !plannedReservation || isSubmitting) return;

        try {
            setIsSubmitting(true);

            await createReservation(
                plannedReservation.room,
                selectedDate,
                plannedReservation.start,
                plannedReservation.end,
                description.trim(),
                user.id,
                selectedParticipants.map(p => p.id)
            );

            const {data} = await fetchReservations(
                selectedDate.toISOString().split('T')[0]
            );
            setReservations(data);

            setPlannedReservation(null);
            setDescription("");

            // Toast 메시지로 변경하면 더 좋을 것 같습니다
            alert("강의실 예약이 완료되었습니다.");

        } catch (error) {
            console.error('예약 생성 중 오류가 발생했습니다:', error);
            alert("예약 중 오류가 발생했습니다. 다시 시도해 주세요.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleParticipantSelect = (participant) => {
        if (!selectedParticipants.some(p => p.id === participant.id)) {
            setSelectedParticipants([...selectedParticipants, participant]);
        }
        setSearchKeyword('');
        setSearchResults([]);
    };

    const removeParticipant = (participantId) => {
        setSelectedParticipants(selectedParticipants.filter(p => p.id !== participantId));
    };

    // 입력 핸들러 수정
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchKeyword(value);
        if (!value.trim()) {
            setSearchResults([]);
            return;
        }
        // 즉시 검색 실행
        debouncedSearch(value);
        console.log('Search input:', value);  // 입력값 로깅
    };

    const infoItems = [
        {
            icon: <User size={20}/>,
            label: "예약자",
            value: user.name
        },
        {
            icon: <Calendar size={20}/>,
            label: "예약 날짜",
            value: formatDate(selectedDate)
        },
        {
            icon: <Clock size={20}/>,
            label: "예약 시간",
            value: `${formatTime(plannedReservation.start)} ~ ${formatTime(plannedReservation.end)}`
        },
        {
            icon: <Layout size={20}/>,
            label: "테이블",
            value: plannedReservation.room
        }
    ];

    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: 20}}
            className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6"
        >
            {/* Header with gradient background */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                    예약 정보
                </h2>
                <button
                    onClick={() => setPlannedReservation(null)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200"
                >
                    <X size={20} className="text-gray-500 hover:text-gray-700"/>
                </button>
            </div>

            <div className="space-y-5">
                {/* Info Items with subtle gradient */}
                {infoItems.map(({icon, label, value}) => (
                    <div key={label} 
                         className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-blue-100 transition-all duration-200">
                        <div className="text-blue-500 mr-4">{icon}</div>
                        <div className="flex-1">
                            <div className="text-sm text-gray-500 mb-0.5">{label}</div>
                            <div className="font-semibold text-gray-800">{value}</div>
                        </div>
                    </div>
                ))}

                {/* Participants Section with modern design */}
                <div className="mt-6">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                        <Users size={20} className="text-blue-500"/>
                        <span>참여자</span>
                    </label>
                    
                    {/* Selected Participants Tags */}
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

                    {/* Search Input with modern styling */}
                    <div className="relative">
                        <input
                            type="text"
                            value={searchKeyword}
                            onChange={handleSearchChange}
                            placeholder="이름으로 참여자 검색"
                            className="w-full p-3 pl-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200"
                        />
                        {isSearching && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-400 border-t-transparent"></div>
                            </div>
                        )}

                        {/* Search Results with enhanced styling */}
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

                {/* Description Textarea with refined style */}
                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">예약 사유</label>
                    <textarea
                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-300 resize-none transition-all duration-200"
                        rows="3"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="예약 사유를 입력해 주세요. (예: CS 스터디)"
                    />
                </div>

                {/* Submit Button with gradient */}
                <motion.button
                    whileHover={{scale: 1.01}}
                    whileTap={{scale: 0.99}}
                    onClick={handleCreateReservation}
                    disabled={isSubmitting}
                    className={`w-full mt-6 px-6 py-3 rounded-xl ${
                        isSubmitting 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                    } text-white font-medium shadow-sm transition-all duration-200`}
                >
                    {isSubmitting ? '예약 중...' : '예약하기'}
                </motion.button>
            </div>
        </motion.div>
    );
};

export default ReservationInfo;