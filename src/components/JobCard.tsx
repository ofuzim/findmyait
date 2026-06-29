import React from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { MapPin, Heart, DollarSign, Clock, Building, Briefcase } from "lucide-react";

interface JobCardProps {
  title: string;
  company?: string | null;
  location?: string | null;
  salary?: string | null;
  highlights: string[];
  postedDate?: string | null;
  facilityType?: string | null;
  employmentType?: string | null;
  chips?: string[];
  isSelected?: boolean;
  onClick?: () => void;
  jobId?: string;
  isLoggedIn?: boolean;
  isApplied?: boolean;
  onApplyClick?: () => void;
  onNavigate?: (page: string) => void;
  isSaved?: boolean;
  onSaveClick?: () => boolean;
  matchScore?: number;
}

export function JobCard({ 
  title, 
  company, 
  location, 
  salary, 
  highlights, 
  postedDate, 
  facilityType,
  employmentType,
  chips = [],
  isSelected = false,
  onClick,
  jobId,
  isLoggedIn = false,
  isApplied = false,
  onApplyClick,
  onNavigate,
  isSaved = false,
  onSaveClick,
  matchScore
}: JobCardProps) {
  return (
    <Card 
      className={`bg-white transition-all duration-200 cursor-pointer group ${
        isSelected 
          ? 'border-2 shadow-lg shadow-blue-100/50 ring-1 ring-blue-100' 
          : 'border border-neutral-200 hover:border-neutral-300 hover:shadow-md'
      }`}
      style={isSelected ? {
        borderColor: 'var(--brand-primary)',
        backgroundColor: 'color-mix(in srgb, var(--brand-primary) 2%, white)'
      } : {}}
      onClick={onClick}
    >
      <CardContent className="p-6 relative">
        {/* Selected indicator */}
        {isSelected && (
          <div 
            className="absolute left-2 top-2 bottom-2 w-1 rounded-full"
            style={{ backgroundColor: 'var(--brand-secondary)' }}
          />
        )}
        
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 
                className="text-lg font-semibold group-hover:underline transition-all duration-200"
                style={{ color: 'var(--brand-primary)' }}
              >
                {title}
              </h3>
              {matchScore !== undefined && (
                <Badge 
                  variant="secondary" 
                  className="bg-green-100 text-green-700 border-green-200"
                >
                  {matchScore}% match
                </Badge>
              )}
            </div>
            {company && (
              <p className="text-base text-neutral-700 mt-1">{company}</p>
            )}
          </div>
          
          <button 
            className={`p-2 rounded-full transition-all duration-200 ${
              !isLoggedIn 
                ? 'cursor-not-allowed opacity-50' 
                : isSaved 
                  ? 'bg-red-50 hover:bg-red-100' 
                  : 'hover:bg-neutral-100'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              if (isLoggedIn && onSaveClick) {
                onSaveClick();
              }
            }}
            disabled={!isLoggedIn}
            title={
              !isLoggedIn 
                ? 'Sign in to save jobs' 
                : isSaved 
                  ? 'Remove from saved jobs' 
                  : 'Save job'
            }
          >
            <Heart className={`h-5 w-5 transition-all duration-200 ${
              !isLoggedIn
                ? 'text-neutral-300'
                : isSaved 
                  ? 'text-red-500 fill-red-500' 
                  : 'text-neutral-400 hover:text-red-500'
            }`} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row md:flex-wrap gap-2 md:gap-4 mb-4">
          {location && (
            <div className="flex items-center text-neutral-600">
              <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="text-sm truncate">{location}</span>
            </div>
          )}
          
          {salary && (
            <div className="flex items-center text-neutral-600">
              <DollarSign className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="text-sm truncate">{salary}</span>
            </div>
          )}
          
          {employmentType && (
            <div className="flex items-center text-neutral-600">
              <Briefcase className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="text-sm">{employmentType}</span>
            </div>
          )}
          
          {facilityType && (
            <div className="flex items-center text-neutral-600">
              <Building className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="text-sm">{facilityType}</span>
            </div>
          )}
        </div>

        {/* Chips/Tags */}
        {chips.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {chips.map((chip, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs px-2 py-1"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--brand-secondary) 15%, white)',
                  color: 'var(--brand-primary)',
                  border: '1px solid color-mix(in srgb, var(--brand-secondary) 25%, white)'
                }}
              >
                {chip}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center">
          {postedDate && (
            <div className="flex items-center text-neutral-500">
              <Clock className="h-4 w-4 mr-1" />
              <span className="text-sm">{postedDate}</span>
            </div>
          )}
          
          {isApplied ? (
            <Button 
              size="sm"
              variant="outline"
              className="font-medium px-6 cursor-default"
              style={{
                backgroundColor: '#f8fafc',
                borderColor: '#cbd5e1',
                color: '#64748b'
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (onNavigate) {
                  onNavigate('dashboard');
                }
              }}
            >
              Applied
            </Button>
          ) : (
            <Button 
              size="sm"
              className="font-medium px-6 transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5"
              style={{
                backgroundColor: 'var(--brand-primary)',
                color: 'white'
              }}
              onMouseEnter={(e) => {
                if (!isApplied) {
                  e.currentTarget.style.backgroundColor = 'var(--brand-primary-hover)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isApplied) {
                  e.currentTarget.style.backgroundColor = 'var(--brand-primary)';
                }
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (onApplyClick) {
                  onApplyClick();
                }
              }}
            >
              {isLoggedIn ? 'Apply Now' : 'Sign In to Apply'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}