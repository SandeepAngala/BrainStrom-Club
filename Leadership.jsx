import chancellorImg from "../assets/chancellor.jpg";
import proChancellorImg from "../assets/prochancellor.jpg";

// No import for the deleted image

const Leadership = () => {
  const leaders = [
    {
      name: "Dr. Jaspal Singh Sandhu",
      title: "Chancellor",
      image: chancellorImg,
      description:
        "Professor Dr. Jaspal Singh Sandhu, an esteemed academician and leader, the Vice Chancellor of LPU, bringing over 35 years of expertise in academia, research, and policy-making. A distinguished specialist in Orthopedics and Sports Medicine, he has played a pivotal role in shaping higher education.",
    },
    {
      name: "Dr. Rashmi Mittal",
      title: "Pro-Chancellor",
      image: proChancellorImg,
      description:
        "Dr. Rashmi Mittal has been instrumental in fostering interdisciplinary research and global collaborations, ensuring a progressive academic environment.",
    },
    {
      name: "Dr. Ramesh Kumar", // Example third leader
      title: "Vice-Chancellor",
      image: "https://via.placeholder.com/400x300", // ✅ placeholder for deleted image
      description:
        "Dr. Ramesh Kumar is a visionary academic leader focusing on innovation, student development, and excellence in higher education.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
        Leadership Team
      </h1>
      <div className="max-w-7xl mx-auto grid gap-12 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
        {leaders.map((leader, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-xl overflow-hidden transition-transform transform hover:-translate-y-2"
          >
            <img
              src={leader.image || "https://via.placeholder.com/400x300"}
              alt={leader.name}
              className="w-full h-72 object-cover"
            />
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                {leader.name}
              </h2>
              <h3 className="text-md font-medium text-blue-600 mb-2">
                {leader.title}
              </h3>
              <p className="text-gray-600 text-sm">{leader.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leadership;
