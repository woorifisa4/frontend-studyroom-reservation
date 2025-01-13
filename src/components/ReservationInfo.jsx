import React, {useState, useCallback} from 'react';
import {Calendar, Clock, User, Layout, X} from 'lucide-react';
import {motion} from 'framer-motion';
import {createReservation} from '../api/createReservation';
import {fetchReservations} from '../api/fetchReservations';

const ReservationInfo = ({user, selectedDate, plannedReservation, setPlannedReservation, setReservations}) => {
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

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
                []
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
            className="w-full max-w-lg bg-white rounded-lg shadow-xl p-6"
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">예약 정보</h2>
                <button
                    onClick={() => setPlannedReservation(null)}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X size={20}/>
                </button>
            </div>

            <div className="space-y-4">
                {infoItems.map(({icon, label, value}) => (
                    <div key={label} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-blue-500 mr-3">{icon}</div>
                        <div className="flex-1">
                            <div className="text-sm text-gray-500">{label}</div>
                            <div className="font-medium">{value}</div>
                        </div>
                    </div>
                ))}

                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        예약 사유
                    </label>
                    <textarea
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                        rows="3"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="예약 사유를 입력해 주세요. (예: CS 스터디)"
                    />
                </div>

                <motion.button
                    whileHover={{scale: 1.02}}
                    whileTap={{scale: 0.98}}
                    onClick={handleCreateReservation}
                    disabled={isSubmitting}
                    className={`w-full mt-6 px-6 py-3 rounded-lg ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white font-medium transition-colors`}>
                    {isSubmitting ? '예약 중...' : '예약하기'}
                </motion.button>
            </div>
        </motion.div>
    );
};

export default ReservationInfo;