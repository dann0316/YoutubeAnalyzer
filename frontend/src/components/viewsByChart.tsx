import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

type ViewsByChartPropsType = {
    views: number;
    likes: number;
    comments: number;
};

const ViewsByChart: React.FC<ViewsByChartPropsType> = ({
    views,
    likes,
    comments,
}) => {
    const data = {
        labels: ["조회수", "좋아요", "댓글"],
        datasets: [
            {
                label: "비율",
                data: [views, likes, comments],
                backgroundColor: [
                    "rgba(75, 192, 192, 0.6)", // 조회수
                    "rgba(255, 206, 86, 0.6)", // 좋아요
                    "rgba(255, 99, 132, 0.6)", // 댓글
                ],
                borderColor: [
                    "rgba(75, 192, 192, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(255, 99, 132, 1)",
                ],
                borderWidth: 1,
            },
        ],
    };

    return <Doughnut data={data} />;
};

export default ViewsByChart;
