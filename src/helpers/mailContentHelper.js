const warningMailCG = function (result) {
    return `Cảnh báo sinh viên ${result?.student_name} gần bị cấm thi môn: <strong>${result?.course_name}</strong> , nhóm: <strong>${result?.group_code}</strong>.
            <br /> Đề nghị sinh viên đi học đầy đủ trong khoảng thời gian tới.
            <br /><li><i>Mọi thắc mắc sinh viên liên hệ với giáo viên hoặc tới văn phòng khoa để giải quyết</i></li>`
}
const banMailCG = function (result) {
    return `Sinh viên ${result?.student_name} bị cấm thi môn: ${result?.course_name}, nhóm: ${result?.group_code}.
            <br /> Nếu có thắc mắc sinh viên vui lòng liên hệ với văn phòng khoa`
}
const multiWarningMailCG = function (course_name, course_group) {
    return `Kính gửi sinh viên thuộc nhóm: <strong>${course_group}</strong>, môn học: <strong>${course_name}</strong>.
    <br />
    <p>Chúng tôi xin lưu ý rằng hiện tại bạn đã vắng mặt khá nhiều buổi học và có nguy cơ bị cấm thi nếu tiếp tục vắng trong các buổi học tới.</p>
    <p>Để tránh ảnh hưởng đến kết quả học tập:</p>
    <li>Vui lòng tham gia đầy đủ các buổi học trong thời gian tới.</li>
    <li>Nếu bạn tin rằng đây là sự nhầm lẫn và bạn đã tham gia đầy đủ các buổi học, vui lòng liên hệ ngay với giảng viên để được hỗ trợ.</li>`
}

const multiBanMailCG = function (course_name, course_group) {
    return `Kính gửi sinh viên thuộc nhóm: <strong>${course_group}</strong>, môn học: <strong>${course_name}</strong>,
    <br/>
    <p>Chúng tôi rất tiếc phải thông báo rằng bạn đã vắng mặt quá nhiều buổi học và đã bị cấm thi theo quy định của nhà trường.</p>
    <p>Để tránh những trường hợp tương tự trong tương lai:</p>
    <li>Chúng tôi khuyến khích bạn tham gia đầy đủ các buổi học..</li>
    <li>Nếu có bất kỳ thắc mắc nào hoặc nếu bạn tin rằng đây là sự nhầm lẫn, vui lòng liên hệ với giảng viên để được giải quyết kịp thời.</li>`
}


module.exports = { warningMailCG, banMailCG, multiWarningMailCG, multiBanMailCG }