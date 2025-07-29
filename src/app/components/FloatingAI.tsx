'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faBolt } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

export default function FloatingAIAssistantIcon() {
  return (
    <div className="fixed bottom-20 right-6 z-50">
      <Link href="/aiCoach">
        <div className="relative ai-assistant w-14 h-14 rounded-full bg-purple-700 shadow-lg flex items-center justify-center cursor-pointer text-white">
          <FontAwesomeIcon icon={faRobot} className="text-xl" />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
            <FontAwesomeIcon icon={faBolt} />
          </div>
        </div>
      </Link>
    </div>
  );
}
