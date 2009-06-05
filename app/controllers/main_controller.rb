class MainController < ApplicationController

	def index
	end

	def getDirContents
		@dirArray = []
		@fileArray = []
		
		dirPath = params[:dirPath]
		
		Dir.new(dirPath).each do |dir|
			(File.directory? dirPath + "/" + dir) ? @dirArray << dir : @fileArray << dir unless dir == '.' or dir == '..' or dir.include?("jpg")
		end	
				
		render :partial =>"sublist"
	end
	
	def loadPlayer
		@songs = params[:songList]
		@height = params[:height]
		render :partial =>"playerLoad"
	end
	
end
