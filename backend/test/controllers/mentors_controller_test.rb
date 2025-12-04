require "test_helper"

class MentorsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @mentor = mentors(:one)
  end

  test "should get index" do
    get mentors_url, as: :json
    assert_response :success
  end

  test "should create mentor" do
    assert_difference("Mentor.count") do
      post mentors_url, params: { mentor: { name: @mentor.name } }, as: :json
    end

    assert_response :created
  end

  test "should show mentor" do
    get mentor_url(@mentor), as: :json
    assert_response :success
  end

  test "should update mentor" do
    patch mentor_url(@mentor), params: { mentor: { name: @mentor.name } }, as: :json
    assert_response :success
  end

  test "should destroy mentor" do
    assert_difference("Mentor.count", -1) do
      delete mentor_url(@mentor), as: :json
    end

    assert_response :no_content
  end
end
