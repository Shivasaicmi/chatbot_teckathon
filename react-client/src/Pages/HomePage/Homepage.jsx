import { useKeycloak } from "@react-keycloak/web";

// eslint-disable-next-line react/prop-types
function HomePage() {
  const { initialized, keycloak } = useKeycloak();

  return (
    // eslint-disable-next-line react/no-unknown-property
    <section className="h-screen w-screen flex" align="center">
      <div className="authentication-left bg-primary w-1/2 h-full">
        <div className="s-blob-main">
          <img
            className="hidden md:block w-40 s-blob-main-logo element-center ls-is-cached lazyloaded"
            src="https://xebia.com/apac/wp-content/uploads/sites/2/2021/11/XebiaLogo-white.svg"
            alt="xebia domains"
            data-src="https://xebia.com/apac/wp-content/uploads/sites/2/2021/11/XebiaLogo-white.svg"
            decoding="async"
            style={{ height: "100vh", marginLeft: "40%" }}
          />
        </div>
      </div>
      <div className="authentication-right bg-success w-1/2 flex justify-center items-center h-full">
        <div className="authenticate-form-container w-2/5">
          <h1 className="text-primary text-center text-3xl mb-7 capitalize font-medium">
            Xebot!!!
          </h1>
          <button
            className="w-full h-12 bg-primary text-secondary rounded-lg hover:bg-primary transition duration-300"
            type="submit"
            onClick={() =>
              keycloak.login({
                redirectUri: "http://localhost:3000/chatbot",
              })
            }
          >
            Login
          </button>
        </div>
      </div>
    </section>
  );
}

export default HomePage;
