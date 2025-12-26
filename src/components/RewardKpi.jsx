import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css/reward.css";

export default function RewardKPI() {
    const [month, setMonth] = useState(12);
    const [reward, setReward] = useState(null);
    const [loading, setLoading] = useState(false);

    const prevMonth = () => {
        setMonth(m => (m === 1 ? 12 : m - 1));
    };

    const nextMonth = () => {
        setMonth(m => (m === 12 ? 1 : m + 1));
    };

    useEffect(() => {
        const fetchReward = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("access_token");

                const res = await axios.get(
                    "http://127.0.0.1:8000/reward/me",
                    {
                        params: { thang: month },
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setReward(res.data);
            } catch (err) {
                console.error("Fetch reward error:", err);
                setReward(null);
            } finally {
                setLoading(false);
            }
        };

        fetchReward();
    }, [month]);

    const renderResult = () => {
        if (!reward) return null;

        if (reward.dat_kpi) {
            return (
                <div className="reward-box success">
                    🎉 Bạn đạt KPI tháng {month} <br />
                    Được nhận <b>thưởng KPI</b>
                </div>
            );
        }

        return (
            <div className="reward-box fail">
                ❌ Bạn <b>không đạt KPI</b> tháng {month} <br />
                Không có thưởng
            </div>
        );
    };

    return (
        <div className="reward-page">
            <h2>THƯỞNG KPI</h2>

            <div className="reward-month">
                <button onClick={prevMonth}>‹</button>
                <span>Tháng {month}</span>
                <button onClick={nextMonth}>›</button>
            </div>

            {loading ? (
                <p>Đang tải dữ liệu...</p>
            ) : (
                renderResult()
            )}
        </div>
    );
}
