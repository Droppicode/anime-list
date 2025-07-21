import React from 'react'

const AnimeCard = ({ anime: {title, episodes, images, score, status, year} }) => {
  return (
    <div className="anime-card">
        <img src={images ? images.webp.large_image_url : '/no-poster.png'} alt={title} />
        
        <div className="mt-4">
            <h3>{title}</h3>

            <div className="content">
                <div className="rating">
                    <img src="star.svg" alt="Star Icon" />
                    <p>{score ? score.toFixed(1) : 'N/A'}</p>
                </div>

                <span>•</span>
                <p className="episodes">{episodes}</p>
                <span>•</span>
                <p className="status">{status}</p>
                <span>•</span>
                <p className="year">{year ? year : 'N/A'}</p>
            </div>
        </div>
    </div>
  )
}

export default AnimeCard