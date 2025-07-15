import { useEffect, useState } from "react";
import type { VideosType } from "../types/youtube.type";

const Detail = ({
  selectedVideo,
  modal,
  setModal,
}: {
  selectedVideo: VideosType;
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  //   useEffect(() => {
  //     if (modal) {
  //       document.body.style.overflow = "hidden";
  //     } else {
  //       document.body.style.overflow = "auto";
  //     }

  //     return () => {
  //       document.body.style.overflow = "auto"; // cleanup
  //     };
  //   }, [modal]);

  const [shouldRender, setShouldRender] = useState(modal);

  useEffect(() => {
    if (modal) {
      setShouldRender(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      // 애니메이션 끝나고 제거
      const timeout = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [modal]);

  if (!shouldRender) return null;

  return (
    <main
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center transition-all duration-300
    ${
      modal ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
    }
    `}
    >
      <div className="w-4/6 h-4/6 border borde-white bg-white rounded-3xl p-10">
        <h4 className="text-3xl">{selectedVideo?.title}</h4>
        <img
                    src={selectedVideo?.thumbnail}
                    loading="lazy"
                    alt="썸네일"
                    className="w-20"
                />
        <button
          onClick={() => {
            setModal(false);
          }}
          className="text-3xl"
        >
          닫기
        </button>
      </div>
    </main>
  );
};

export default Detail;
