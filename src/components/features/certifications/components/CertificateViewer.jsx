import { memo, useState, useCallback } from "react";
import PropTypes from "prop-types";


const CertificateViewer = ({
  title,
  issuer,
  date,
  image,
  credentialUrl,
  description,
}) => {
  const [imageError, setImageError] = useState(false);


  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);


  const handleCredentialOpen = useCallback(() => {
    if (!credentialUrl) return;

    window.open(
      credentialUrl,
      "_blank",
      "noopener,noreferrer"
    );
  }, [credentialUrl]);


  return (
    <article
      className="
        group
        overflow-hidden
        rounded-2xl
        border
        bg-white
        shadow-sm
        transition
        duration-300
        hover:shadow-xl
      "
      aria-label={`${title} certificate`}
    >

      <div
        className="
          relative
          aspect-video
          overflow-hidden
          bg-gray-100
        "
      >

        {!imageError ? (
          <img
            src={image}
            alt={`${title} certificate issued by ${issuer}`}
            loading="lazy"
            decoding="async"
            onError={handleImageError}
            className="
              h-full
              w-full
              object-cover
              transition
              duration-300
              group-hover:scale-105
            "
          />
        ) : (
          <div
            className="
              flex
              h-full
              items-center
              justify-center
              text-sm
              text-gray-500
            "
          >
            Certificate preview unavailable
          </div>
        )}

      </div>


      <div
        className="
          space-y-3
          p-6
        "
      >

        <header>
          <h3
            className="
              text-xl
              font-semibold
              text-gray-900
            "
          >
            {title}
          </h3>


          <p
            className="
              text-sm
              text-gray-600
            "
          >
            {issuer}
          </p>
        </header>


        <p
          className="
            text-sm
            text-gray-500
          "
        >
          Issued: {date}
        </p>


        {description && (
          <p
            className="
              text-sm
              leading-relaxed
              text-gray-600
            "
          >
            {description}
          </p>
        )}


        {credentialUrl && (
          <button
            type="button"
            onClick={handleCredentialOpen}
            aria-label={`Verify ${title} credential`}
            className="
              rounded-lg
              bg-black
              px-5
              py-2
              text-sm
              font-medium
              text-white
              transition
              hover:opacity-80
              focus:outline-none
              focus:ring-2
            "
          >
            Verify Credential
          </button>
        )}

      </div>

    </article>
  );
};


CertificateViewer.propTypes = {
  title: PropTypes.string.isRequired,
  issuer: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  credentialUrl: PropTypes.string,
  description: PropTypes.string,
};


CertificateViewer.defaultProps = {
  credentialUrl: null,
  description: "",
};


export default memo(CertificateViewer);
