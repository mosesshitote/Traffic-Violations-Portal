/*
TRAFFIC VIOLATIONS PORTAL
saiy2k (http://saiy2k.blogspot.in)

This file is part of Traffic Violation Portal project (https://github.com/GethuGames/Traffic-Violations-Portal).

Traffic-Violations-Portal is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Traffic-Violations-Portal is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with ACR-Timeline-Infograph. If not, see <http://www.gnu.org/licenses/>.
*/

var trafficApp = angular.module('TrafficApp');

/**
 * Controller responsible for listing Videos and complaints
 * Sample Video Object {
        videoID: 125461,
        videoURL: 'http://www.youtube.com/dfiJKLs23j',
        thumbURL: 'http://gfoi.com/traffic/saiy2k/yy-mm-dd-hh-mm.jpg',
        uploadedBy: 'saiy2k',
        analyzedBy: 'saiy3k',
        locality: 'Kalaignar Arch',
        town: 'Saidapet',
        city: 'Chennai',
        pincode: 600015,
        time: 'yyyy-mm-dd-hh-mm',
        officerInCharge: 'Mr. Sathappan',
        complaints: []
    }
 */
trafficApp.controller('VideoController', ['$scope',
                                          '$http',
                                          '$log',
                                          'createDialog',
                                          'ComplaintService',
                                          'UserService',
                                          'VideoService',
                                          'YoutubeService',
                                          function($scope,
                                                   $http,
                                                   $log,
                                                   createDialogService,
                                                   complaintService,
                                                   userService,
                                                   videoService,
                                                   youtubeService) {

    /** array of videos */
    $scope.videos               =   [];

    /** ref to Complaint Service */
    $scope.complaint            =   videoService.complaint;

    /** Object to hold data for new videos */
    $scope.newVid               =   {};

    /** is the User logged in or not */
    $scope.isLoggedIn           =   userService.user.name != '';

    $scope.complaintService     =   complaintService;

    videoService.getVideos(function(vids) {
        $scope.videos           =   vids;
    });

    $scope.upload = function() {
        createDialogService('app/video/UploadModal.html', {
          id: 'simpleDialog',
          title: 'Upload Video to save India',
          backdrop: true,
          controller: 'VideoController',
          success: {label: 'Success', fn: function() {console.log('Simple modal closed');}}
        });
    };

    $scope.analyze = function(vid) {
        createDialogService('app/complaint/AnalyzeModal.html', {
          id: 'analyzeDialog',
          title: 'Analyze Video',
          backdrop: true,
          controller: 'ComplaintController',
          success: {label: 'Success', fn: function() {console.log('Simple modal closed');}}
        }, {
            video: vid
        });
    };

    $scope.addNewVideo = function() {
        var vid                 =   {};
        vid["videoURL"]         =   $scope.newVid.videoURL;
        vid["thumbURL"]         =   $scope.newVid.videoURL;
        vid["uploadedBy"]       =   userService.user.userName;
        vid["analyzedBy"]       =   "";
        vid["locality"]         =   $scope.newVid.locality;
        vid["town"]             =   $scope.newVid.town;
        vid["city"]             =   $scope.newVid.city;
        vid["pincode"]          =   $scope.newVid.pincode;
        vid["time"]             =   $scope.newVid.time;
        vid["complaints"]       =   [];
        vid["rawComplaints"]    =   [];
        vid["policePresent"]    =   false;
        vid["policeName"]       =   "";

        videoService.addNewVideo(vid);

        var videoID             =   youtubeService.getVideoID(vid['videoURL']);
        youtubeService.getVideoDuration(videoID, function(duration) {
            userService.awardPoint(userService.user.userName, duration, function(data) {
               //console.log(data);
            }); 
        });
    };

    $scope.$on('videoAdded', function() {
        $scope.videos.push(videoService.newVid);
    });

    $scope.$on('user:updated', function() {
        $scope.isLoggedIn       =   userService.user.name != '';
    });

}]);

