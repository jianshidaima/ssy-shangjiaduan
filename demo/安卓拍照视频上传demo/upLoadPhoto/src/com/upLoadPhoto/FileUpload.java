package com.upLoadPhoto;

import java.io.File;
import java.io.IOException;
import java.util.*;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

public class FileUpload extends HttpServlet {
    /**
	 * 
	 */
	private static final long serialVersionUID = 8788625573740741280L;

	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        req.setCharacterEncoding("UTF-8");
        fileControl(req, resp);
    }
	
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        req.setCharacterEncoding("UTF-8");
        fileControl(req, resp);
    }

    /**
     * 上传文件的处理
     */
    private void fileControl(HttpServletRequest request, HttpServletResponse response) throws ServletException , ServletException, IOException {
    	 // 上传文件目录
        String uploadDir = this.getServletContext().getRealPath("/uploadFile");
        DiskFileItemFactory factory = new DiskFileItemFactory();
        // 设置内存区块大小4KB
        factory.setSizeThreshold(4 * 1024);
        // 设置暂存容器，当上传文件大于设置的内存块大小时，用暂存容器做中转
        factory.setRepository(new File(this.getServletContext().getRealPath("/temp")));
        ServletFileUpload fileUpload = new ServletFileUpload(factory);
        fileUpload.setSizeMax(1024 * 1024 * 100);
        //fileUpload.setFileSizeMax(1024 * 1024 * 10);
        List<FileItem> fileItemList = null;

        try {
            fileItemList = fileUpload.parseRequest(request);
        } catch (Exception e) {
            e.printStackTrace();
        }
        Iterator<FileItem> fileItemIterator = fileItemList.iterator();
        FileItem fileItem = null;
        while (fileItemIterator.hasNext()) {
            fileItem = fileItemIterator.next();
            // 普通文件框上传
            if (fileItem.isFormField()) {
                String filedName = fileItem.getFieldName();
                String filedValue = fileItem.getString("GBK");// 编码格式
                System.out.println(filedName);// 文件框名称
                System.out.println(filedValue);// 文件的值
            } else {
                String filedName = fileItem.getFieldName();// 文件上传框的名称
                // 获取文件上传的文件名
                String OriginalFileName = takeOutFileName(fileItem.getName());
                System.out.println("原始文件名："+OriginalFileName);
                if (!"".equals(OriginalFileName)) {
                    // 根据上传的文件名重新命名
                    String newFileName = getNewFileName(OriginalFileName);
                    System.out.println("重新名："+newFileName);
                    File writeToFile = new File(uploadDir + File.separator + newFileName);
                    try {
                        fileItem.write(writeToFile);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        }
    }

    private String takeOutFileName(String filePath) {
        String fileName = filePath;
        if (null != filePath && !"".equals(filePath)) {
            int port = filePath.lastIndexOf("\\");
            if(port != -1){
                fileName = filePath.substring(port+1);
            }
        }
        return fileName;
    }

    private String getNewFileName(String originalFileName) {
        StringBuffer newFileName = new StringBuffer();
        if (null != originalFileName && !"".equals(originalFileName)) {
            int port = originalFileName.lastIndexOf(".");
            String type = "";
            String fileName = "";
            if (port != -1) {
                type = originalFileName.substring(port + 1);
                fileName = originalFileName.substring(0, port);
            } else {
                fileName = originalFileName;
            }
            StringBuffer suffix = new StringBuffer("_");
            suffix.append(Calendar.getInstance().getTimeInMillis());
            suffix.append("_");
            suffix.append(new Random().nextInt(100));
            newFileName.append(fileName);
            newFileName.append(suffix);
            newFileName.append(".");
            newFileName.append(type);
        }
        return newFileName.toString();
    }
}