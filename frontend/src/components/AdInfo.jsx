import React from "react";
import star from '../assets/star.png';
import { useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import secureAxios from "../secureAxios";

function AdInfo({ ad }) {
  if (!ad) {
    return (
      <div className="bg-white border border-gray-300 rounded p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
          <p className="text-gray-600 ml-3">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-300 rounded p-6">
      <div className="flex items-center gap-4 mb-6">
        <img
          className="w-16 h-16 rounded-full object-cover border border-gray-300"
          src={ad.user.profile}
          alt="Profile"
        />
       
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-800 mb-1">{ad.user.name}</h3>
          <h4 className="text-lg font-semibold text-gray-600 mb-2">{ad.title}</h4>
         
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-gray-500 text-sm">(4.8) • 23 reviews</span>
          </div>
         
          <div className="flex items-center gap-2 text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm">{ad.user.location}</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <img
          className="w-full h-64 object-cover rounded border border-gray-300"
          src={ad.skill_picture}
          alt="Skill"
        />
      </div>

      <div className="space-y-4">
        <h5 className="text-lg font-semibold text-gray-800">About this skill</h5>
        <p className="text-gray-700 leading-relaxed">{ad.description}</p>
      </div>
    </div>
  );
}

export default AdInfo;