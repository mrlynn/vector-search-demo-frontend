import React, { useState } from "react";
import { User, Server, Database, Key, X } from "lucide-react";

const AtlasClusterSetup = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const steps = [
    {
      icon: User,
      title: "Create an Atlas Account",
      description:
        "Sign up for a free MongoDB Atlas account at mongodb.com. If you already have an account, skip this step.",
      color: "bg-blue-500",
      image: "/screenshot1.png",
      action: () => window.open("https://www.mongodb.com/cloud/atlas", "_blank"),
    },
    {
      icon: Server,
      title: "Deploy a Free Cluster",
      description:
        "In the Atlas UI, deploy a free tier cluster by selecting a cloud provider and region.",
      color: "bg-green-500",
      image: "/screenshot2.png",
      action: () =>
        window.open(
          "https://www.mongodb.com/docs/atlas/tutorial/deploy-free-tier-cluster/",
          "_blank"
        ),
    },
    {
      icon: Database,
      title: "Load Sample Datasets",
      description:
        "Go to the cluster's '...' menu, select 'Load Sample Dataset', and wait for the data to populate.",
      color: "bg-purple-500",
      image: "/screenshot3.png",
      action: null,
    },
    {
      icon: Key,
      title: "Get the Connection String",
      description:
        "Click 'Connect' in the Atlas UI, select 'Connect Your Application', and copy the connection string.",
      color: "bg-[#00ED64]",
      image: "/atlassetup.gif",
      action: null,
    },
  ];

  const openModal = (index) => {
    setActiveStep(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        MongoDB Atlas Free Cluster Setup
      </h2>
      <div className="relative">
        {/* Horizontal Scroll Container */}
        <div className="flex overflow-x-auto space-x-8 pb-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={index}
                className="flex-shrink-0 w-64 p-4 rounded-lg bg-white shadow-md cursor-pointer hover:shadow-lg transition-transform transform hover:scale-105"
                onClick={() => openModal(index)}
              >
                {/* Icon and Title */}
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${step.color}`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {step.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mt-2">{step.description}</p>

                {/* Screenshot */}
                {step.image && (
                  <img
                    src={step.image}
                    alt={`Screenshot for ${step.title}`}
                    className="mt-4 rounded-lg shadow-sm"
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Step {activeStep + 1}: {steps[activeStep].title}
                </h3>
                <button
                  className="text-gray-600 hover:text-gray-800"
                  onClick={closeModal}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="space-y-4">
                <p className="text-gray-600">{steps[activeStep].description}</p>
                {steps[activeStep].image && (
                  <img
                    src={steps[activeStep].image}
                    alt={`Screenshot for ${steps[activeStep].title}`}
                    className="rounded-lg shadow-md w-full"
                  />
                )}
                {steps[activeStep].action && (
                  <button
                    onClick={steps[activeStep].action}
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                  >
                    Learn More
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AtlasClusterSetup;
